<script>
    import Icon from "@iconify/svelte"
    import {page} from "$app/state";
    import {GET} from "$lib/assets/scripts/apiCalls.js";

    let project = $state({})
    let technos = $state([])
    let gallery = $state([])
    let image = $state([])

    const getProjectData = async () => {
        const data = await GET(`projects/${page.params.slug}`, localStorage.getItem("token"))
        console.log(data)
        project = data.project
        technos = data.technos
        image = data.image[0]
        gallery = data.galleries

    }

    $inspect(image)
    getProjectData()
</script>

<div class="h-screen">
    <div class="grid grid-cols-2 gap-3 h-4/6 w-10/12 mx-auto py-20">
        <div class="border border-teal-400 rounded-md p-5">
            <h1 class="text-4xl text-center">{project.name}</h1>
            <p>{project.description}</p>
            <a href={project.link}>Lien</a>
        </div>
        <div class="border border-teal-400 rounded-md p-5">
            <h2 class="text-4xl text-center">Technos</h2>
            <div class="flex flex-row flex-wrap">
                {#each technos as techno}
                    <div class="bg-base-100 rounded-md p-2 m-1">
                        <Icon icon={techno.icon} width="40" class="mx-auto" />
                        {techno.name}
                    </div>
                {/each}
            </div>
        </div>
        <div class="border border-teal-400 rounded-md p-5">
            <h2 class="text-4xl text-center">Image</h2>
            <img src={'https://minio-api.server.kevinb.run/portfolio-projects/'+image.url} alt={image.url} class="w-1/2 mx-auto">
        </div>
        <div class="border border-teal-400 rounded-md p-5">
            <h2 class="text-4xl text-center">Galerie</h2>
            <div class="flex flex-row flex-nowrap gap-3 items-center justify-center">
                {#each gallery as galleryItem}
                    <img src={'https://minio-api.server.kevinb.run/portfolio-projects/'+galleryItem.url} alt={galleryItem.url} class="w-1/3">
                {/each}
            </div>
        </div>
    </div>
</div>

