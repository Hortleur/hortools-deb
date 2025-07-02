<script>
    import Icon from "@iconify/svelte"
    import {CREATE} from "$lib/assets/scripts/apiCalls.js";
    let props = $props()

    let galleryUrlsCount = $state(1)

    let technoIds = $state([])
    let imageUrl = $state('')
    let name = $state('')
    let description = $state('')
    let link = $state('')
    let galleryUrls = $state([])

    let projectData = $state({})


    const createProject = async() => {
        for (let i = 1; i < galleryUrlsCount+1; i++) {
            galleryUrls.push(document.getElementById(`galleryUrl-${i}`).value)
        }
        //
        projectData = {
            name,
            description,
            link,
            imageUrl,
            galleryUrls,
            technoIds
        }

        const res = await CREATE('projects', localStorage.getItem('token'), projectData)

        await create_project_modal.close()
    }


    $inspect(projectData)

</script>

<dialog id="create_project_modal" class="modal">
    <div class="modal-box">
        <form class="w-full" id="createProjectForm">
            <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-md border p-4">
                <legend class="fieldset-legend">Projet</legend>

                <label for="name" class="input w-full">
                    <span class="label">Nom</span>
                    <input type="text" name="name" id="" bind:value={name}>
                </label>

                <label for="description" class="textarea w-full">
                    <span class="label">Description</span>
                    <textarea name="description" bind:value={description} class="w-full"></textarea>
                </label>

                <label for="link" class="input w-full">
                    <span class="label">Lien</span>
                    <input type="text" name="link" bind:value="{link}" class="w-full">
                </label>

                <label for="image" class="input w-full">
                    <span class="label">Url de l'image</span>
                    <input type="text" name="image" id="" bind:value={imageUrl} class="w-full">
                </label>

                <div class="flex flex-col">
                    {#each {length: galleryUrlsCount}, index}
                        <label for={'galleryUrl-'+ index+1} class="input w-full">
                            <span class="label">galleryUrl-{index+1}</span>
                            <input type="text" name="galleryUrl" id={`galleryUrl-${index+1}`} class="w-full">
                        </label>
                    {/each}
                    <div class="my-3">
                        {#if galleryUrlsCount > 1}
                            <button class="btn btn-square btn-error" onclick={()=> galleryUrlsCount--}>-</button>
                        {/if}
                        <button class="btn btn-square btn-info" onclick={()=> galleryUrlsCount++}>+</button>
                    </div>

                </div>
                <div class="grid grid-cols-4 gap-3 place-items-center">
                    {#each props.technos as techno}
                        <div class="flex flex-col flex-nowrap items-center">
                            <Icon icon={techno.icon} width="30"/>
                            <input type="checkbox" name={techno.name} id="" value={techno.id} bind:group={technoIds} class="checkbox" >
                        </div>
                    {/each}
                </div>
            </fieldset>
            <div class="flex flex-row flex-nowrap justify-around mt-3">
                <button class="btn btn-success btn-lg" onclick={()=> createProject()}>Créer</button>
                <button class="btn btn-error btn-lg" onclick={()=>create_project_modal.close()}>Annuler</button>
            </div>
        </form>
    </div>
</dialog>