<script>
    /** @type {import('./$types').PageData} */
    export let data;
    const { movies } = data;
</script>

<h1>Movies</h1>

{#each movies as movie}
    <div class="card-th mb-4 text-sm">
        <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} />
	<h2>{movie.title}</h2>
	<p>{movie.overview}</p>
    </div>
{/each}