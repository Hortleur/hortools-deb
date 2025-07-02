<script>
    import {CREATE, DELETE, GET, UPDATE} from "$lib/assets/scripts/apiCalls.js";

    let typeName = $state('')

    let typeToEdit = $state({})

    let allTechnoTypes = $state([])
    const allTechTypes = async() => {
        const res = await GET('techno_types', localStorage.getItem('token'))
        allTechnoTypes = res.technoTypes
    }

    const createType = async() => {
        await CREATE('techno_types', localStorage.getItem('token'), {name: typeName})
        await allTechTypes()
        await create_type_modal.close()
    }

    const deleteType = async(id) => {
        await DELETE('techno_types', localStorage.getItem('token'), id)
        await allTechTypes()
    }

    const openEditModal = (type) => {
        typeToEdit = type
        edit_type_modal.showModal()
    }

    const editType = async() => {
        await UPDATE('techno_types', localStorage.getItem('token'), typeToEdit.id, {name: typeToEdit.name})
        await allTechTypes()
        await edit_type_modal.close()
    }

    allTechTypes()
</script>

<div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
    <table class="table">
        <!-- head -->
        <thead>
        <tr>
            <th>id</th>
            <th>Name</th>
            <th>actions</th>
        </tr>
        </thead>
        <tbody>
        <!-- row 1 -->
        {#each allTechnoTypes as technoType}
            <tr>
                <th>{technoType.id}</th>
                <td>{technoType.name}</td>
                <td>
                    <button class="btn btn-warning" onclick={()=> openEditModal(technoType)}>Modifier</button>
                    <button class="btn btn-error" onclick={()=> deleteType(technoType.id)}>Supprimer</button>
                </td>
            </tr>
        {/each}
        </tbody>
    </table>
</div>
<button class="btn btn-success mt-5" onclick={()=> create_type_modal.showModal()}>Créer Type</button>

<dialog id="create_type_modal" class="modal">
    <div class="modal-box">
        <label for="" class="input">
            <span class="label">Nom</span>
            <input type="text" bind:value={typeName}>
        </label>
        <button class="btn-wide btn btn-success" onclick={()=> createType()}>Créer type</button>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button class="btn btn-error">Fermer</button>
    </form>
</dialog>

<dialog id="edit_type_modal" class="modal">
    <div class="modal-box">
        <label for="" class="input">
            <span class="label">Nom</span>
            <input type="text" bind:value={typeToEdit.name}>
        </label>
        <button class="btn-wide btn btn-success" onclick={()=> editType()}>Modifier type</button>
        <button class="btn btn-wide btn-error" onclick={()=> edit_type_modal.close()}>Annuler</button>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button class="btn btn-error">Fermer</button>
    </form>
</dialog>