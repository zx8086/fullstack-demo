<script>
    /** @type {import('./$types').PageData} */
    export let data;

    console.log("Passed data through prop", data);

    // Use a reactive statement to update the displayed data when `data` changes
    $: looksData = data.data || [];

</script>

<!-- Displaying the looks data -->
{#if looksData.length > 0}
<div class="bg-white">
    <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {#each looksData as look}
                <div class="group relative">
                    <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                        <img src={look.assetUrl} alt={look.title} class="h-full w-full object-cover object-center lg:h-full lg:w-full">
                    </div>
                    <div class="mt-4 flex justify-between">
                        <div>
                            <h3 class="text-sm text-gray-700">
                                <a href="#">
                                    <span aria-hidden="true" class="absolute inset-0"></span>
                                    {look.title}
                                </a>
                            </h3>
                            <p class="mt-1 text-sm text-gray-500">{look.brand}</p>
                        </div>
                        <p class="text-sm font-medium text-gray-900">$35</p>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>
{:else}
  <p>No looks data available.</p>
{/if}
