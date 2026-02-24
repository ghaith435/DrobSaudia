const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'riyadh-admin-secret-key-2026';

// Database connection
const pool = new Pool({
    connectionString: 'postgresql://riyadh:riyadh123@localhost:5432/mydb'
});

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Auth middleware
const authMiddleware = async (req, res, next) => {
    const token = req.cookies.admin_token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const result = await pool.query('SELECT id, email, name, role FROM users WHERE id = $1', [decoded.id]);

        if (result.rows.length === 0 || result.rows[0].role !== 'ADMIN') {
            return res.status(403).json({ error: 'Forbidden' });
        }

        req.user = result.rows[0];
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// ==================== AUTH ROUTES ====================

// Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];

        if (user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

        res.cookie('admin_token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            sameSite: 'lax'
        });

        res.json({
            success: true,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Logout
app.post('/api/logout', (req, res) => {
    res.clearCookie('admin_token');
    res.json({ success: true });
});

// Check auth status
app.get('/api/auth/status', authMiddleware, (req, res) => {
    res.json({ authenticated: true, user: req.user });
});

// ==================== DASHBOARD ROUTES ====================

// Get dashboard stats
app.get('/api/dashboard', authMiddleware, async (req, res) => {
    try {
        const [users, places, requests, categories, views, activities] = await Promise.all([
            pool.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE "isActive" = true) as active FROM users'),
            pool.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE "isFeatured" = true) as featured FROM places'),
            pool.query(`SELECT COUNT(*) as total, 
                COUNT(*) FILTER (WHERE status = 'PENDING') as pending,
                COUNT(*) FILTER (WHERE status = 'IN_PROGRESS') as in_progress,
                COUNT(*) FILTER (WHERE status = 'COMPLETED') as completed FROM user_requests`),
            pool.query('SELECT COUNT(*) as total FROM categories'),
            pool.query('SELECT COUNT(*) as total FROM page_views'),
            pool.query('SELECT COUNT(*) as total FROM activity_logs WHERE "createdAt" > NOW() - INTERVAL \'24 hours\'')
        ]);

        res.json({
            users: {
                total: parseInt(users.rows[0].total),
                active: parseInt(users.rows[0].active)
            },
            places: {
                total: parseInt(places.rows[0].total),
                featured: parseInt(places.rows[0].featured)
            },
            requests: {
                total: parseInt(requests.rows[0].total),
                pending: parseInt(requests.rows[0].pending),
                inProgress: parseInt(requests.rows[0].in_progress),
                completed: parseInt(requests.rows[0].completed)
            },
            categories: parseInt(categories.rows[0].total),
            pageViews: parseInt(views.rows[0].total),
            todayActivities: parseInt(activities.rows[0].total)
        });
    } catch (err) {
        console.error('Dashboard error:', err);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

// ==================== USERS ROUTES ====================

// Get all users
app.get('/api/users', authMiddleware, async (req, res) => {
    const { page = 1, limit = 20, role, status, search } = req.query;
    const offset = (page - 1) * limit;

    try {
        let whereClause = '1=1';
        const params = [];
        let paramIndex = 1;

        if (role) {
            whereClause += ` AND role = $${paramIndex++}`;
            params.push(role);
        }

        if (status === 'active') {
            whereClause += ` AND "isActive" = true`;
        } else if (status === 'inactive') {
            whereClause += ` AND "isActive" = false`;
        }

        if (search) {
            whereClause += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        params.push(limit, offset);

        const usersResult = await pool.query(
            `SELECT id, name, "nameAr", email, phone, role, "isActive", "isVerified", "createdAt", "lastLoginAt"
             FROM users WHERE ${whereClause}
             ORDER BY "createdAt" DESC
             LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
            params
        );

        const countResult = await pool.query(`SELECT COUNT(*) FROM users WHERE ${whereClause}`, params.slice(0, -2));

        res.json({
            users: usersResult.rows,
            total: parseInt(countResult.rows[0].count),
            page: parseInt(page),
            totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
        });
    } catch (err) {
        console.error('Users error:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Update user
app.patch('/api/users/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name, role, isActive, isVerified } = req.body;

    try {
        const updates = [];
        const params = [];
        let paramIndex = 1;

        if (name !== undefined) {
            updates.push(`name = $${paramIndex++}`);
            params.push(name);
        }
        if (role !== undefined) {
            updates.push(`role = $${paramIndex++}`);
            params.push(role);
        }
        if (isActive !== undefined) {
            updates.push(`"isActive" = $${paramIndex++}`);
            params.push(isActive);
        }
        if (isVerified !== undefined) {
            updates.push(`"isVerified" = $${paramIndex++}`);
            params.push(isVerified);
        }

        updates.push(`"updatedAt" = NOW()`);
        params.push(id);

        const result = await pool.query(
            `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
            params
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error('Update user error:', err);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Delete user
app.delete('/api/users/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Delete user error:', err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// ==================== REQUESTS ROUTES ====================

// Get all requests
app.get('/api/requests', authMiddleware, async (req, res) => {
    const { page = 1, limit = 20, status, type } = req.query;
    const offset = (page - 1) * limit;

    try {
        let whereClause = '1=1';
        const params = [];
        let paramIndex = 1;

        if (status) {
            whereClause += ` AND r.status = $${paramIndex++}`;
            params.push(status);
        }

        if (type) {
            whereClause += ` AND r.type = $${paramIndex++}`;
            params.push(type);
        }

        params.push(limit, offset);

        const requestsResult = await pool.query(
            `SELECT r.*, u.name as user_name, u.email as user_email
             FROM user_requests r
             LEFT JOIN users u ON r."userId" = u.id
             WHERE ${whereClause}
             ORDER BY r."createdAt" DESC
             LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
            params
        );

        const countResult = await pool.query(
            `SELECT COUNT(*) FROM user_requests r WHERE ${whereClause}`,
            params.slice(0, -2)
        );

        res.json({
            requests: requestsResult.rows,
            total: parseInt(countResult.rows[0].count),
            page: parseInt(page),
            totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
        });
    } catch (err) {
        console.error('Requests error:', err);
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
});

// Update request
app.patch('/api/requests/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { status, response, priority, assignedTo } = req.body;

    try {
        const updates = [];
        const params = [];
        let paramIndex = 1;

        if (status !== undefined) {
            updates.push(`status = $${paramIndex++}`);
            params.push(status);
            if (status === 'COMPLETED') {
                updates.push(`"resolvedAt" = NOW()`);
            }
        }
        if (response !== undefined) {
            updates.push(`response = $${paramIndex++}`);
            params.push(response);
        }
        if (priority !== undefined) {
            updates.push(`priority = $${paramIndex++}`);
            params.push(priority);
        }
        if (assignedTo !== undefined) {
            updates.push(`"assignedTo" = $${paramIndex++}`);
            params.push(assignedTo);
        }

        updates.push(`"updatedAt" = NOW()`);
        params.push(id);

        const result = await pool.query(
            `UPDATE user_requests SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
            params
        );

        res.json({ success: true, request: result.rows[0] });
    } catch (err) {
        console.error('Update request error:', err);
        res.status(500).json({ error: 'Failed to update request' });
    }
});

// ==================== PLACES ROUTES ====================

// Get all places
app.get('/api/places', authMiddleware, async (req, res) => {
    const { page = 1, limit = 20, category } = req.query;
    const offset = (page - 1) * limit;

    try {
        let whereClause = '1=1';
        const params = [];
        let paramIndex = 1;

        if (category) {
            whereClause += ` AND p."categoryId" = $${paramIndex++}`;
            params.push(category);
        }

        params.push(limit, offset);

        const placesResult = await pool.query(
            `SELECT p.*, c.name as category_name, c."nameAr" as category_name_ar
             FROM places p
             LEFT JOIN categories c ON p."categoryId" = c.id
             WHERE ${whereClause}
             ORDER BY p."viewCount" DESC
             LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
            params
        );

        const countResult = await pool.query(
            `SELECT COUNT(*) FROM places p WHERE ${whereClause}`,
            params.slice(0, -2)
        );

        res.json({
            places: placesResult.rows,
            total: parseInt(countResult.rows[0].count),
            page: parseInt(page),
            totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
        });
    } catch (err) {
        console.error('Places error:', err);
        res.status(500).json({ error: 'Failed to fetch places' });
    }
});

// ==================== ACTIVITIES ROUTES ====================

// Get activity logs
app.get('/api/activities', authMiddleware, async (req, res) => {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    try {
        const result = await pool.query(
            `SELECT a.*, u.name as user_name, u.email as user_email
             FROM activity_logs a
             LEFT JOIN users u ON a."userId" = u.id
             ORDER BY a."createdAt" DESC
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        const countResult = await pool.query('SELECT COUNT(*) FROM activity_logs');

        res.json({
            activities: result.rows,
            total: parseInt(countResult.rows[0].count),
            page: parseInt(page),
            totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
        });
    } catch (err) {
        console.error('Activities error:', err);
        res.status(500).json({ error: 'Failed to fetch activities' });
    }
});

// ==================== CATEGORIES ROUTES ====================

// Get categories
app.get('/api/categories', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM categories ORDER BY "order" ASC, "createdAt" DESC'
        );
        res.json({ categories: result.rows });
    } catch (err) {
        console.error('Categories error:', err);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// Serve the admin dashboard
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🏛️  RIYADH GUIDE - ADMIN PANEL                             ║
║                                                               ║
║   Server running at: http://localhost:${PORT}                   ║
║                                                               ║
║   Login credentials:                                          ║
║   📧 Email: admin@riyadh-guide.com                            ║
║   🔑 Password: admin123                                       ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
    `);
});
