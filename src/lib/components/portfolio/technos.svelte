<script>
    import {GET, DELETE, CREATE, UPDATE} from "$lib/assets/scripts/apiCalls.js";
    import Icon from "@iconify/svelte"

    let allTechnos = $state([])
    let allTechTypes = $state([])

    let technoToCreateName = $state('')
    let technoToCreateIcon = $state('')
    let technoToCreateTypes = $state([])

    let technoToEdit = $state({
        id: 0,
        name: '',
        icon: '',
        technoTypeIds: []
    })


    const getAllTechnos = async() => {
        const res = await GET('technos', localStorage.getItem('token'))
        allTechnos = res.technos
    }

    const getAllTechTypes = async() => {
        const res = await GET('techno_types', localStorage.getItem('token'))
        allTechTypes = res.technoTypes
    }

    const handleTypeCheckbox = (id) => {
        if (technoToCreateTypes.includes(id)) {
            technoToCreateTypes = technoToCreateTypes.filter(type => type !== id)
        } else {
            technoToCreateTypes.push(id)
        }
    }
    const handleEditTypeCheckbox = (technoHandeled) => {
        let isPresent = Boolean(technoToEdit.technoTypeIds.find(tech => tech.id === technoHandeled.id))
        if (isPresent){
            const techIndex = technoToEdit.technoTypeIds.findIndex(tech => tech.id === technoHandeled.id)
            technoToEdit.technoTypeIds.splice(techIndex, 1)
        } else {
            technoToEdit.technoTypeIds.push(technoHandeled)
        }
    }


    const createTech = async() => {
        let technoTypesIds = technoToCreateTypes.map(type => type)
        let data = {
            name: technoToCreateName,
            icon: technoToCreateIcon,
            technoTypeIds: technoTypesIds
        }

        const res = await CREATE('technos', localStorage.getItem('token'), data)
        if (res.message) {
            alert(res.message)
        }
        await getAllTechnos()
        technoToCreateName = ''
        technoToCreateIcon = ''
        technoToCreateTypes = []

        window.document.getElementById('createTechForm').reset()

        await create_techno_modal.close()
    }

    const openEditModal = async (tech) => {
        technoToEdit.id = tech.id
        technoToEdit.name = tech.name
        technoToEdit.icon = tech.icon
        technoToEdit.technoTypeIds = tech.types

        edit_techno_modal.showModal()
    }

    $inspect(technoToEdit)
    const closeEditModal = () => {

        window.document.getElementById('editTechForm').reset()
        edit_techno_modal.close()

    }

    const editTech = async() => {
        let id = technoToEdit.id
        let data = {
            name : technoToEdit.name,
            icon : technoToEdit.icon,
            technoTypeIds: technoToEdit.technoTypeIds.map(tech => tech.id)
        }

        const res = await UPDATE('technos', localStorage.getItem('token'), id, data)
        await getAllTechnos()
        closeEditModal()
    }


    const deleteTechno = async(id) => {
        const res = await DELETE('technos', localStorage.getItem('token'), id)
        await getAllTechnos()
    }

    getAllTechnos()
    getAllTechTypes()
</script>

<div class="overflow-x-auto overflow-y-scroll max-h-[70dvh] rounded-box border border-base-content/5 bg-base-100">
    <table class="table">
        <thead>
        <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Icon</th>
            <th>Tech Types</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {#each allTechnos as techno}
            <tr>
                <th>{techno.id}</th>
                <td>{techno.name}</td>
                <td><Icon bind:icon={techno.icon} width="40"/></td>
                <td>
                    {#each techno.types as techType}
                        <span class="badge badge-soft badge-info">{techType.name} </span>
                    {/each}
                </td>
                <td>
                    <button class="btn btn-warning" onclick={()=>openEditModal(techno)}>Modifier</button>
                    <button class="btn btn-error" onclick={()=> deleteTechno(techno.id)}>Supprimer</button>
                </td>
            </tr>
        {/each}
        </tbody>
    </table>
</div>
<button class="btn btn-success mt-5" onclick={()=> create_techno_modal.showModal()}>Créer Techno</button>

<dialog id="create_techno_modal" class="modal">
    <div class="modal-box">
        <form action="" id="createTechForm">
            <label for="" class="input">
                <span class="label">Nom</span>
                <input type="text" bind:value={technoToCreateName}>
            </label>
            <label for="" class="input">
                <span class="label">Icon</span>
                <input type="text" bind:value={technoToCreateIcon}>
            </label>
            <fieldset class="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
                <legend class="fieldset-legend">Types</legend>
                <label for="">
                    {#each allTechTypes as techType}
                        <li class="list list-none flex flex-row gap-2">
                            <span>{techType.name}</span>
                            <input type="checkbox" class="checkbox" value={techType.id} oninput={()=>handleTypeCheckbox(techType.id)}>
                        </li>
                    {/each}
                </label>
            </fieldset>
        </form>
        <button class="btn w-full btn-success" onclick={()=> createTech()}>Créer Techno</button>
        <button class="btn w-full btn-error" onclick={()=> create_techno_modal.close()}>Annuler</button>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button class="btn btn-error">Fermer</button>
    </form>
</dialog>

<dialog id="edit_techno_modal" class="modal">
    <div class="modal-box flex flex-col gap-3">
        <form action="" id="editTechForm" class="flex flex-col gap-3">
            <label for="" class="input">
                <span class="label">Nom</span>
                <input type="text" bind:value={technoToEdit.name}>
            </label>
            <label for="" class="input">
                <span class="label">Icon</span>
                <input type="text" bind:value={technoToEdit.icon}>
            </label>
            <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                <legend class="fieldset-legend">Types</legend>
                <div class="flex flex-col flex-nowrap">

                        {#each allTechTypes as techType}
                                {#if technoToEdit.technoTypeIds.find(tech => tech.id === techType.id)}
                                    <label for="flex flex-row">
                                        <span class="label">{techType.name}</span>
                                        <input type="checkbox" name={techType.name} value={techType.id} class="checkbox" checked onchange={()=>handleEditTypeCheckbox(techType)}>
                                    </label>
                                {:else}
                                    <label for="flex flex-row">
                                        <span class="label">{techType.name}</span>
                                        <input type="checkbox" name={techType.name} value={techType.id} class="checkbox" onchange={()=>handleEditTypeCheckbox(techType)}>
                                    </label>
                                {/if}
                        {/each}
                </div>
            </fieldset>
        </form>
        <button class="btn w-full btn-success" onclick={()=> editTech()}>Modifier Techno</button>
        <button class="btn w-full btn-error" onclick={()=> closeEditModal()}>Annuler</button>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button class="btn btn-error">Fermer</button>
    </form>
</dialog>