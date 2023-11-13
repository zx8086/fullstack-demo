/** @type {import('./$types').PageServerLoad} */
import 'dotenv/config'

export const load = async () => {
    console.log('Server Load Ran')
    const fetchMovies = async () => {
        const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=7fc9901c3d0d631151d9b2b02e68221b`)
        const data = await res.json()
        return data.results
    }

    return {
        movies: fetchMovies(),
    }
};