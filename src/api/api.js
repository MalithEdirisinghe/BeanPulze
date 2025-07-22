const BASE_URL = 'http://52.204.147.119:5000';

export const predictDisease = async (data) => {
    try {
        const response = await fetch(`${BASE_URL}/predict_disease`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export default {
    predictDisease,
};
