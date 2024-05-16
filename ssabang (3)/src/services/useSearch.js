import { ref } from 'vue';
import axios from 'axios';

export function useSearch() {
    const keyword = ref('');
    const searchResult = ref(null);
    const searchDetails = ref({ type: null, id: null, location: null, name: null, zoom: null });
    const error = ref(null);

    async function searchKeyword() {
        const searchUrl = `https://www.dabangapp.com/api/3/loc/search-keyword?api_version=3.0.1&call_type=web&keyword=${encodeURIComponent(keyword.value)}&limit=25&version=1`;
        try {
            const response = await axios.get(searchUrl);
            const data = response.data;
            if (data.region.length > 0) {
                searchDetails.value = {
                    type: 'region',
                    id: data.region[0].code,
                    location: data.region[0].location,
                    name: data.region[0].name,
                    zoom: data.region[0].zoom
                };
            } if (data.subway.length > 0) {
                searchDetails.value = {
                    type: 'subway',
                    id: data.subway[0].subway_id,
                    location: data.subway[0].location,
                    name: data.subway[0].name,
                    zoom: data.subway[0].zoom
                };
            } if (data.univ.length > 0) {
                searchDetails.value = {
                    type: 'univ',
                    id: data.univ[0].univ_id,
                    location: data.univ[0].location,
                    name: data.univ[0].name,
                    zoom: data.univ[0].zoom
                };
            }
            searchResult.value = true;  // Indicates a successful search
        } catch (err) {
            error.value = err;
            console.error('Error searching locations:', err);
        }
    }

    return { keyword, searchResult, searchDetails, error, searchKeyword };
}
