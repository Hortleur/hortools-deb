<script>
    import { openUrl } from "@tauri-apps/plugin-opener";
    import { fade, slide } from 'svelte/transition'
    import {GET, UPDATE, DELETE, CREATE} from "$lib/assets/scripts/apiCalls.js";

    let token = localStorage.getItem('token')
    let alertMsg = $state('')
    let showAlert = $state(false)

    //candidatures

    let allCandidatures = $state([])
    let company = $state('')
    let candidatureStatusId = $state(0)
    let link = $state('')
    let dateOfApplication = $state('')
    let candidatureToEdit = $state({
        id: 0,
        company: '',
        statusId: 0,
        link: '',
        dateOfApplication: ''
    })

    const getCandidatures = async() => {
        let candidaturesData = await GET('candidatures', token)
        allCandidatures = candidaturesData.candidatures
    }

    const setCandidatureToEdit = async(candidatureItem) => {
        candidatureToEdit.id = candidatureItem.id
        candidatureToEdit.company = candidatureItem.company
        candidatureToEdit.statusId = candidatureItem.statusId
        candidatureToEdit.link = candidatureItem.link
        candidatureToEdit.dateOfApplication = candidatureItem.dateOfApplication.split('T')[0]

        editCandidatureModal.showModal()
    }

    const editCandidature = async() => {
        const data = {
            link : candidatureToEdit.link,
            company : candidatureToEdit.company,
            statusId : candidatureToEdit.statusId,
            dateOfApplication : candidatureToEdit.dateOfApplication
        }
        let response = await UPDATE('candidatures', token, candidatureToEdit.id, data)
        if (response.ok) {
            showAlertMessage(response.message)
        }
        await getCandidatures()
        await editCandidatureModal.close()
    }

    const createCandidature = async() => {
        console.log(company, candidatureStatusId, link, dateOfApplication)
        const response = await CREATE('candidatures', token, {
            company: company,
            statusId: candidatureStatusId,
            link: link,
            dateOfApplication: dateOfApplication
        })
        if (response.ok) {
            showAlertMessage(response.message)
        }
        await getCandidatures()
        await candidatureModal.close()
    }

    const showAlertMessage = (msg) => {
        showAlert = true
        alertMsg = msg
        setTimeout(() => {
            showAlert = false
            alertMsg = ''
        }, 3000)
    }

    const deleteCandidature = async(id) => {
        const data = await DELETE('candidatures', token, id)
        if (data.ok) {
            showAlertMessage(data.message)
        }
        await getCandidatures()
    }

    getCandidatures()



    //status

    let statusName = $state('')
    let statusId = $state(0)
    let statusToOpen = $state('')
    let allStatus = $state([])

    const getAllStatus = async() => {
        let statusData = await GET('status', token)

        allStatus = statusData.statuses
    }

    const createStatus = async() => {
        const data = {
            name: statusName
        }
        const response = await CREATE('status', token, data)
        if (response.ok) {
            showAlertMessage(response.message)
        }
        await getAllStatus()
        defineActionForStatus('','',0)
    }

    const defineActionForStatus = (action= '', statusToEdit= '', statusIdToEdit= 0) => {
        if (action === 'editStatus') {
            statusName = statusToEdit
            statusId = statusIdToEdit
        }
        statusToOpen = action
    }

    const editStatus = async() => {
        const data = {
            name:statusName
        }
        let response = await UPDATE('status', token,statusId, data)
        if (response.ok) {
            showAlertMessage(response.message)
        }
        await getAllStatus()
        await getCandidatures()
    }

    const deleteStatus = async(id= 0) => {
        const data = await DELETE('status', token, id)
        if (data.ok) {
            showAlertMessage(data.message)
        }
        await getAllStatus()
    }

    getAllStatus()
</script>

<div class="container mx-auto">
    {#if showAlert}
        <div role="alert" class="alert alert-success alert-dash" in:slide out:slide>
            <span>{alertMsg}</span>
        </div>
    {/if}
    <h1 class="text-6xl text-center">Candidatures</h1>
    <div>
        <button class="btn my-10" onclick={() => statusModal.showModal()}>Afficher les status</button>

        <button class="btn" onclick={() => candidatureModal.showModal()}>Créer une candidature</button>
    </div>


    <div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table class="table">
            <!-- head -->
            <thead>
            <tr>
                <th></th>
                <th>Entreprise</th>
                <th>Status</th>
                <th>Lien</th>
                <th>Date de Candidature</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {#each allCandidatures as candidature}
                <tr>
                    <th>{candidature.id}</th>
                    <td>{candidature.company}</td>
                    <td>{candidature.status.name}</td>
                    <td><button class="btn btn-square btn-primary" onclick="{async() => await openUrl(candidature.link)}">link</button></td>
                    <td>{new Date(candidature.dateOfApplication).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-warning" onclick={()=> setCandidatureToEdit(candidature)}>Modifier</button>
                        <button class="btn btn-error" onclick={() => deleteCandidature(candidature.id)}>Supprimer</button>
                    </td>
                </tr>
            {/each}
            </tbody>
        </table>
    </div>

    <dialog id="statusModal" class="modal">
        <div class="modal-box">
            <div class="flex flex-row flex-nowrap justify-between">
                <h3 class="text-lg font-bold">Créer status</h3>
                <button class="btn btn-success" onclick={()=>defineActionForStatus('createStatus')}>Créer</button>
            </div>
            <table class="table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {#each allStatus as status}
                    <tr>
                        <th>{status.id}</th>
                        <th>{status.name}</th>
                        <th>
                            <button class="btn btn-warning" onclick={()=>defineActionForStatus('editStatus', status.name, status.id)}>Modifier</button>
                            <button class="btn btn-error" onclick={()=> deleteStatus(status.id)}>Supprimer</button>
                        </th>
                    </tr>
                {/each}
                </tbody>
            </table>

            {#if statusToOpen === "createStatus"}
                <form method="dialog" onsubmit={() => createStatus()}>
                    <label for="name" class="input input-bordered input-neutral mb-2">
                        <span class="label">Nom</span>
                        <input type="text" name="name" bind:value={statusName}>
                    </label>
                    <div>
                        <button class="btn btn-success" type="submit">Créer</button>
                        <button class="btn btn-error" onclick={()=>defineActionForStatus('')}>Annuler</button>
                    </div>
                </form>
            {:else if statusToOpen === "editStatus"}
                <form method="dialog" onsubmit={() => editStatus()}>
                    <input type="number" bind:value={statusId} hidden>
                    <label for="name" class="input input-bordered input-neutral mb-2">
                        <span class="label">Nom</span>
                        <input type="text" name="name" bind:value={statusName}>
                    </label>
                    <div>
                        <button class="btn btn-success" type="submit">Modifier</button>
                        <button class="btn btn-error" onclick={()=>defineActionForStatus('')}>Annuler</button>
                    </div>
                </form>
            {/if}
            <form method="dialog" class="modal-backdrop mt-5">
                <button class="btn btn-error">Annuler</button>
            </form>
        </div>
    </dialog>

    <dialog id="candidatureModal" class="modal">
        <div class="modal-box">
            <h3 class="text-lg font-bold">Créer une candidature</h3>
            <form class="flex flex-col flex-nowrap gap-2">
                <label for="company" class="input input-bordered w-full">
                    <span class="label">Entreprise</span>
                    <input type="text" name="company" bind:value={company}>
                </label>
                <label for="status" class="select select-bordered w-full">
                    <span class="label">Status</span>
                    <select bind:value={candidatureStatusId}>
                        {#each allStatus as status}
                            <option value={status.id}>{status.name}</option>
                        {/each}
                    </select>
                </label>
                <label for="link" class="input input-bordered w-full">
                    <span class="label">Lien</span>
                    <input type="text" name="link" bind:value={link}>
                </label>
                <label for="dateOfApplication" class="input input-bordered w-full">
                    <span class="label">Date de candidature</span>
                    <input type="date" name="dateOfApplication" bind:value={dateOfApplication}>
                </label>
                <button type="submit" class="btn btn-success" onclick={()=>createCandidature()}>Créer</button>
                <button class="btn btn-error" onclick={() => candidatureModal.close()}>close</button>
            </form>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>Fermer</button>
        </form>
    </dialog>


    <dialog id="editCandidatureModal" class="modal">
        <div class="modal-box">
            <h3 class="text-lg font-bold">Modifier une candidature</h3>
            <form class="flex flex-col flex-nowrap gap-2">
                <label for="company" class="input input-bordered w-full">
                    <span class="label">Entreprise</span>
                    <input type="text" name="company" bind:value={candidatureToEdit.company}>
                </label>
                <label for="status" class="select select-bordered w-full">
                    <span class="label">Status</span>
                    <select bind:value={candidatureToEdit.statusId}>
                        {#each allStatus as status}
                            <option value={status.id}>{status.name}</option>
                        {/each}
                    </select>
                </label>
                <label for="link" class="input input-bordered w-full">
                    <span class="label">Lien</span>
                    <input type="text" name="link" bind:value={candidatureToEdit.link}>
                </label>
                <label for="dateOfApplication" class="input input-bordered w-full">
                    <span class="label">Date de candidature</span>
                    <input type="date" name="dateOfApplication" bind:value={candidatureToEdit.dateOfApplication}>
                </label>
                <button type="submit" class="btn btn-success" onclick={()=>editCandidature()}>Modifier</button>
                <button class="btn btn-error" onclick={() => editCandidatureModal.close()}>close</button>
            </form>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>Fermer</button>
        </form>
    </dialog>
</div>