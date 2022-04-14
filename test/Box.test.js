const {expect} = require('chai');
const { ethers } = require("hardhat");

describe('Box Contract', () => {
	let Box, box,Jack, jack, box_addr,jack_addr, owner, addr1, addr2;
	const name 					= "Box";
	const symbol 				= "BOX";
	const version 				= "1.0.0";
	const zeroAddr      		= "0x0000000000000000000000000000000000000000000000000000000000000000";
	const MAX_SUPPLY 			= "7777";
	const UpdtMrklRoot  		= "0x1a8ca0930b6aed3d141e1367e9681c1899dfe079d4619483a3a5365f7df7f1ac";
	const MAX_PUBLIC_MINT 		= "10";
	const PUBLIC_SALE_PRICE 	= "9000000000000000"; // 0.009 ethers == 9000000000000000 wei
	const MAX_WHITELIST_MINT 	= "3";
	const WHITELIST_SALE_PRICE 	= "2000000000000000"; // 0.002 ethers == 2000000000000000 wei
	const jack_address			= "0xc3A1Dc669D820baB5eA53C77f190F563762981ee";


	beforeEach(async () => {
		Box = await ethers.getContractFactory('Box');
		box = await upgrades.deployProxy(Box, [], {initializer: 'initialize'});

		// Jack = await ethers.getContractFactory('Jack');
		// jack = await upgrades.deployProxy(Jack, [], {initializer: 'initialize'});


		[owner, addr1, addr2, _] = await ethers.getSigners();
	});

	describe('Deployment', () => {
		
		it('Should set the right owner', async () => {
			expect(await box.owner()).to.equal(owner.address);
		});

		it('Should verify the name of contract', async () => {
			expect((await box.name()).toString()).to.equal(name);
		});

		it('Should verify the symbol of contract', async () => {
			expect((await box.symbol()).toString()).to.equal(symbol); 
		});

		it('Should verify the PUBLIC_SALE_PRICE of contract', async () => {
			expect((await box.PUBLIC_SALE_PRICE()).toString()).to.equal(PUBLIC_SALE_PRICE); 
		});

		it('Should verify the MAX_PUBLIC_MINT of contract', async () => {
			expect((await box.MAX_PUBLIC_MINT()).toString()).to.equal(MAX_PUBLIC_MINT); 
		});

		it('Should verify the WHITELIST_SALE_PRICE of contract', async () => {
			expect((await box.WHITELIST_SALE_PRICE()).toString()).to.equal(WHITELIST_SALE_PRICE); 
		});

		it('Should verify the MAX_WHITELIST_MINT of contract', async () => {
			expect((await box.MAX_WHITELIST_MINT()).toString()).to.equal(MAX_WHITELIST_MINT); 
		});

        it('Should verify the MAX_SUPPLY of contract', async () => {
	        expect((await box.MAX_SUPPLY()).toString()).to.equal(MAX_SUPPLY);
	    });

        it('Should verify the version of contract', async () => {
			expect(await box.version()).to.equal(version); 
		});

		it('Should verify the whiteListSale of contract to be false', async () => {
			expect(await box.whiteListSale()).to.equal(false); 
		});

		it('Should verify the isRevealed of contract to be false', async () => {
			expect(await box.isRevealed()).to.equal(false); 
		});

		it('Should verify the publicSale of contract to be false', async () => {
			expect(await box.publicSale()).to.equal(false); 
		});

		it('Should verify the merkleRoot of contract to be 0x00...', async () => {
			expect(await box.getMerkleRoot()).to.equal(zeroAddr);
		});


		it('Should verify the totalSupply of contract to be 0', async () => {
			expect(await box.totalSupply()).to.equal('0');
		});

		it('Should verify the tokensMintedtBy of contract to be 0', async () => {
			expect(await box.tokensMintedtBy(owner.address)).to.equal(0);
		});

		it('Should verify the tokensBurntBy of contract to be 0', async () => {
			expect(await box.tokensBurntBy(owner.address)).to.equal(0);
		});

	});

	describe('Transactions', () =>{

		it("Should set the whiteListSale to True", async function () {
			await box.deployed();
			expect(await box.whiteListSale()).to.equal(false);
			const toggleWhiteListSaleTx = await box.toggleWhiteListSale();
			await toggleWhiteListSaleTx.wait();
			expect(await box.whiteListSale()).to.equal(true);
		});

     
	 	it("Should set the isRevealed to True", async function () {
	        await box.deployed();
	        expect(await box.isRevealed()).to.equal(false);
	        const toggleRevealTx = await box.toggleReveal();
	        await toggleRevealTx.wait();
	        expect(await box.isRevealed()).to.equal(true);
      	});

		it("Should set the publicSale to True", async function () {
	        await box.deployed();
	        expect(await box.publicSale()).to.equal(false);
	        const togglePublicSaleTx = await box.togglePublicSale();
	        await togglePublicSaleTx.wait();
	        expect(await box.publicSale()).to.equal(true);
      	});

		it('should set  and verify MerkleRoot to whitelist the users addresses', async () => {
			await box.deployed();
	        expect(await box.getMerkleRoot()).to.equal(zeroAddr);
	        const setMerkleRootTx = await box.setMerkleRoot(UpdtMrklRoot);
	        await setMerkleRootTx.wait();
	        expect(await box.getMerkleRoot()).to.equal(UpdtMrklRoot);
		});

		it('should mint a token and verify the possession of the minted token', async () => {
			await box.deployed();

			// Toggle the public sale
			const togglePublicSaleTx = await box.togglePublicSale();
	        await togglePublicSaleTx.wait();

			// mint the token 
	        expect((await box.balanceOf(owner.address)).toString()).to.equal('0');
	        await box.mint(1,{  value: PUBLIC_SALE_PRICE });
	        expect((await box.balanceOf(owner.address)).toString()).to.equal('1');

			// verify the owner balance
			const ownerBalance = await box.balanceOf(owner.address);

			// verify the totalSupply
			expect(await box.totalSupply()).to.equal(ownerBalance);

			// verify ownerOf the token using tokenId
			expect((await box.ownerOf(0)).toString()).to.equal(owner.address);
	        
		});


		it('should set  and verify JackAddress to mint the Jack', async () => {
			await box.deployed();
	        expect(await box.getMerkleRoot()).to.equal(zeroAddr);
	        const setJackAddressTx = await box.setJackAddress(jack_address);
	        await setJackAddressTx.wait();
	        expect(await box.getJackAddress()).to.equal(jack_address);
		});

		
		
		
		// it('should burn a token and verify the possession of the burned token', async () => {
		// 	await box.deployed();
		// 	await jack.deployed();
			

		// 	box_addr 	= await upgrades.erc1967.getImplementationAddress(box.address);
		// 	jack_addr 	= await upgrades.erc1967.getImplementationAddress(jack.address);


		// 	const setJackAddressTx = await box.setJackAddress(jack_addr);
	    //     await setJackAddressTx.wait();


		// 	const setBoxAddressTx = await jack.setBoxAddress(box_addr);
	    //     await setBoxAddressTx.wait();
			

		// 	const tokenMint 		= 10;
		// 	const tokenBurn 		= 4;
		// 	const amount 			= (tokenMint * PUBLIC_SALE_PRICE).toString();
			
			
	    //     // Toggle the public sale
		// 	const togglePublicSaleTx = await box.togglePublicSale();
	    //     await togglePublicSaleTx.wait();

		// 	// mint the token 
	    //     expect((await box.tokensMintedtBy(owner.address))).to.equal(0);
	    //     await box.mint(tokenMint, {  value: amount });

		// 	// verify tokens minted 
		// 	expect((await box.tokensMintedtBy(owner.address))).to.equal(tokenMint);

		// 	// after minting ownerBalance and totalSupply Updated..
		// 	const totalSupplyTx 	= await box.totalSupply();
		// 	const ownerBalanceTx 	= await box.balanceOf(owner.address);


		// 	// burn the token
		// 	const burnTx = await box.burn(tokenBurn);
		// 	await burnTx.wait();
			
		// 	// check owner token 
		// 	expect((await box.balanceOf(owner.address))).to.equal(ownerBalanceTx - tokenBurn);

		// 	// check owner burnt token
		// 	expect((await box.tokensBurntBy(owner.address))).to.equal(tokenBurn);

		// 	// check totalSupply must be deducted
		// 	expect(await box.totalSupply()).to.equal(totalSupplyTx - tokenBurn);

		// 	// check Jack totalSupply must be increased
		// 	expect(await jack.totalSupply()).to.equal(tokenBurn);

			
		// });
		
	});

});