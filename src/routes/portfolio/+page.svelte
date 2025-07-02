<script>
    import Project from "$lib/components/portfolio/project.svelte";
import TechnoType from "$lib/components/portfolio/technoType.svelte";
    import Technos from "$lib/components/portfolio/technos.svelte";

    let actualSubject = $state('project')

    const changeSubject = (subject) => {
        actualSubject = subject
    }
</script>

<div>
    <h1 class="text-center font-bold text-6xl">Portfolio</h1>

    <div class="my-5">
        <button class="btn " onclick={()=> changeSubject('project')}>Projets</button>
        <button class="btn " onclick={()=> changeSubject('technos')}>Technos</button>
        <button class="btn " onclick={()=> changeSubject('technoTypes')}>Types de Technos</button>
    </div>

    {#if actualSubject === 'project'}
        <Project />
    {:else if actualSubject === 'technos'}
        <Technos />

    {:else if actualSubject === 'technoTypes'}
        <TechnoType />
    {/if}

</div>