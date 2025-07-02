<script>
    import {goto} from "$app/navigation";

    let email = $state('')
    let password = $state('')

    const logIn = async(event) => {
        event.preventDefault()
        console.log(email, password)
        const logInfo = await fetch('http://hortools.server.kevinb.run/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        })

        const logInfoJson = await logInfo.json()
        console.log(logInfoJson)

        const token = logInfoJson.token.token
        const tokenType = logInfoJson.token.type

        localStorage.setItem('token', token)
        localStorage.setItem('tokenType', tokenType)

        goto('/')
    }
</script>

<div class="container mx-auto grid h-screen place-items-center">
    <div>
        <h1 class="text-6xl text-center mb-3">Connexion</h1>

        <form action="" onsubmit={logIn}>
            <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                <label for="" class="label">Email</label>
                <input type="email" name="" id="" class="input input-accent input-bordered" bind:value={email}>
                <label for="" class="label">Mot de passe</label>
                <input type="password" class="input input-accent input-bordered" bind:value={password}>
                <button type="submit" class="btn btn-primary">Se Connecter</button>
            </fieldset>
        </form>
    </div>
</div>