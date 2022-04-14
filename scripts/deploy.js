// scripts/deploy.js
const { ethers, upgrades } = require('hardhat');
const fs = require('fs');

async function main () {
    const Cntrct = await ethers.getContractFactory('Box');
    console.log('Deploying...');
    const cntrct = await upgrades.deployProxy(
        Cntrct, 
        [], 
        { initializer: 'initialize' }
    );
    await cntrct.deployed();
    const addresses = {
        proxy: cntrct.address,
        admin: await upgrades.erc1967.getAdminAddress(cntrct.address), 
        implementation: await upgrades.erc1967.getImplementationAddress(
            cntrct.address)
    };
    console.log('Addresses:', addresses);

    try { 
        await run('verify', { address: addresses.implementation });
    } catch (e) {}

    fs.writeFileSync('deployment-addresses.json', JSON.stringify(addresses));
}

main();