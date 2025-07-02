<script>
    import Icon from "@iconify/svelte"
    import {GET, DELETE} from "$lib/assets/scripts/apiCalls.js";
    import CreateProjectModal from "./createProjectModal.svelte";

    let allProjects = $state([])
    let allTechnos = $state([])



    const getAllProjects = async () => {
        const res = await GET('projects', localStorage.getItem('token'))
        allProjects = res.projects
    }

    const getAllTechnos = async () => {
        const res = await GET('technos', localStorage.getItem('token'))
        allTechnos = res.technos
    }

    const deleteProject = async (id) => {
        const res = await DELETE('projects', localStorage.getItem('token'), id)

        await getAllProjects()
    }

    getAllProjects()
    getAllTechnos()
</script>

<div>
    <button class="btn btn-success my-2" onclick={()=> create_project_modal.showModal()}>Créer un projet</button>
    <div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table class="table">
            <!-- head -->
            <thead>
            <tr>
                <th></th>
                <th>Nom</th>
                <th>description</th>
                <th>lien</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {#each allProjects as project, index}
                <tr>
                    <th>{project.id}</th>
                    <td>{project.name}</td>
                    <td>{project.description}</td>
                    <td>{project.link}</td>
                    <td>
                        <a href={`/portfolio/${project.id}`} class="btn btn-info"><Icon icon="solar:eye-broken" width="30"/></a>
                        <button class="btn btn-error" onclick={()=> deleteProject(project.id)}><Icon icon="tabler:trash-x" width="30" /></button>
                    </td>
                </tr>
            {/each}
            </tbody>
        </table>
    </div>
</div>

<CreateProjectModal technos={allTechnos} />