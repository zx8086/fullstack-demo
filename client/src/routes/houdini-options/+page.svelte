<script>
    /* @type { import('./$houdini').PageData } */
    export let data
    
    $: ({ getOptions } = data)

</script>

<!-- <div>
    {$getOptions.data.options[0].description}
</div> -->

{#if $getOptions.data.options}
    <div>
        {#each $getOptions.data.options as option}
            <div class="card-th mb-4">
                <p>{option.description}</p>
                <p>{option.fashionability}</p>
                <p>{option.salesOrganizationCode}</p>
                <p>{option.styleSeasonCode}</p>
                <p>{option.activeOption}</p>
                <p>{option.isAvailable}</p>
                <p>{option.isSoldOut}</p>
                <p>{option.isCancelled}</p>
            </div>
        {/each}
    </div>
{/if}