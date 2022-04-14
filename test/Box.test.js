const {expect} = require('chai');
const { ethers } = require("hardhat");

describe('Box Contract', () => {
	let Box, box,Jack, jack, box_addr,jack_addr, owner, addr1, addr2;
	// const TOKEN_ID 				= "1";
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
		box = await Box.deploy();
		await box.deployed();
		// Jack = await ethers.getContractFactory('Jack');
		// jack = await upgrades.deployProxy(Jack, [], {initializer: 'initialize'});


		[owner, addr1, addr2, _] = await ethers.getSigners();
	});

	describe('Deployment', () => {
		
		it('Should set the right owner', async () => {
			expect(await box.owner()).to.equal(owner.address);
		});

		// it('Should verify the TOKEN_ID of contract', async () => {
		// 	expect((await box.TOKEN_ID()).toString()).to.equal(TOKEN_ID); 
		// });

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

		it('Should verify the balanceOf of contract to be 0', async () => {
			expect(await box.ownerHolds(owner.address)).to.equal(0);
		});

		it('Should verify the tokenWhitelistMintBy of owner to be 0', async () => {
			expect(await box.tokenWhitelistMintBy(owner.address)).to.equal(0);
		});

		it('Should verify the tokenPublicMintBy of owner to be 0', async () => {
			expect(await box.tokenPublicMintBy(owner.address)).to.equal(0);
		});

		it('Should verify the tokenBurnBy of contract to be 0', async () => {
			expect(await box.tokenBurnBy(owner.address)).to.equal(0);
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
			let  ownerBalance = 0;
			let inc = 0;

			// Toggle the public sale
			const togglePublicSaleTx = await box.togglePublicSale();
	        await togglePublicSaleTx.wait();

			// verify the owner balance to be 0
			ownerBalance = await box.ownerHolds(owner.address);
	        expect(ownerBalance).to.equal(0);

			// mint the token 
	        await box.mint(inc,{  value: PUBLIC_SALE_PRICE });

			// verify the owner balance to be 1
			ownerBalance = await box.ownerHolds(owner.address);
	        expect(ownerBalance).to.equal(inc);

			// verify the totalSupply to 1
			expect(await box.totalSupply()).to.equal(inc);
		        
		});


		it('should set  and verify JackAddress to mint the Jack', async () => {
			await box.deployed();
	        expect(await box.getMerkleRoot()).to.equal(zeroAddr);
	        const setJackAddressTx = await box.setJackAddress(jack_address);
	        await setJackAddressTx.wait();
	        expect(await box.getJackAddress()).to.equal(jack_address);
		});

	});

});