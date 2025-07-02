export const GET = async(endpoint, token) => {
    const data = await fetch(`http://hortools.server.kevinb.run/api/${endpoint}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        },
    })
    const res = await data.json()

    if (!data.ok) {
        return data.message
    }

    return res
}

export const CREATE = async(endpoint, token, dataToCreate) => {
    const data = await fetch(`http://hortools.server.kevinb.run/api/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToCreate)
    })
    const res = await data.json()

    if (!data.ok) {
        return data.message
    }
    return res
}

export const UPDATE = async(endpoint, token, itemId, dataToEdit) => {

    const data = await fetch(`http://hortools.server.kevinb.run/api/${endpoint}/${itemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToEdit)
    })
    const res = await data.json()

    if (!data.ok) {
        return data.message
    }
    return res
}

export const DELETE = async(endpoint, token, id) => {
    const data = await fetch(`http://hortools.server.kevinb.run/api/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        },
    })
    const res = await data.json()
    if (!data.ok) {
        return data.message
    }
    return res
}