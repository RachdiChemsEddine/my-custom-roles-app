const fetch = require('node-fetch').default;

// add role names to this object to map them to group ids in your AAD tenant
const roleGroupMappings = {
    'admin': 'c2b16c0b-96c3-48db-bbf9-7dcd19072f13',
    'reader': 'c92881e3-d075-46d7-a304-f23e0046a384'
};

module.exports = async function (context, req) {
    const user = req.body || {};
    const roles = [];
    
    for (const [role, groupId] of Object.entries(roleGroupMappings)) {
        if (await isUserInGroup(groupId, user.accessToken)) {
            roles.push(role);
        }
    }

    context.res.json({
        roles
    });
}

async function isUserInGroup(groupId, bearerToken) {
    const url = new URL('https://graph.microsoft.com/v1.0/me/memberOf');
    console.log(`Checking if user is in group ${groupId}`);
    console.log(`Bearer token: ${bearerToken}`);
    console.log(`URL: ${url}`);
    url.searchParams.append('$filter', `id eq '${groupId}'`);
    console.log(`searchparams : ${url.searchParams.append('$filter', `id eq '${groupId}'`)}`);
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${bearerToken}`
        },
    });

    console.log(`Response: ${response}`);

    if (response.status !== 200) {
        return false;
    }

    const graphResponse = await response.json();
    const matchingGroups = graphResponse.value.filter(group => group.id === groupId);
    return matchingGroups.length > 0;
}
