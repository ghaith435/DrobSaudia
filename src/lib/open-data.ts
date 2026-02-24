export interface ResourceColumn {
    name: string;
    type: string;
    description: string;
}

export interface Resource {
    id: string;
    name: string;
    descriptionEn: string;
    descriptionAr: string;
    format: string;
    columns: ResourceColumn[];
    downloadUrl: string;
    createdAt: string;
    updatedAt: string;
}

export interface SpatialDataResponse {
    transactionId: string;
    datasetId: string;
    resources: Resource[];
}

/**
 * Fetches spatial data from the Open Data API.
 * 
 * @param dataset The dataset ID or name (Arabic or English).
 * @param version The version of the dataset (default: -1).
 * @returns The spatial data response containing resources.
 */
export const fetchSpatialData = async (dataset: string, version: number = -1): Promise<SpatialDataResponse> => {
    const url = `https://open.data.gov.sa/data/api/datasets?version=${version}&dataset=${encodeURIComponent(dataset)}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch spatial data: ${response.statusText}`);
        }

        const data: SpatialDataResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching spatial data:', error);
        throw error;
    }
};
