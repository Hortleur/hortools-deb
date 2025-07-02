<script>
    import '$lib/assets/app.css';
    import Navigation from '$lib/components/navigation.svelte';
    import { page } from "$app/state";

    let actualUrl = $state(page.url.pathname)
    let token = $state(localStorage.getItem('token'))

    let { children } = $props();
</script>

<main class="h-screen">
    {@render children()}
    {#if token}
        <Navigation actualRoute={actualUrl}/>
    {/if}
</main>