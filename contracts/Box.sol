// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Jack.sol";
import "erc721a-upgradeable/contracts/ERC721AUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "erc721a-upgradeable/contracts/extensions/ERC721ABurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/MerkleProofUpgradeable.sol";

contract Box is Initializable, ERC721AUpgradeable, ERC721ABurnableUpgradeable, OwnableUpgradeable{

    uint256 public constant MAX_SUPPLY = 7777;
    uint256 public constant MAX_PUBLIC_MINT = 10;
    uint256 public constant MAX_WHITELIST_MINT = 3;
    uint256 public constant PUBLIC_SALE_PRICE = .009 ether;
    uint256 public constant WHITELIST_SALE_PRICE = .002 ether;

    bool public isRevealed;
    bool public publicSale;
    bool public whiteListSale;
    bytes32 private merkleRoot;
    string private baseTokenUri;
    address private jack_address;

    // mapping(address => uint256) private adressMint;
    // mapping(address => uint256) private addressBurn;
    
    function initialize() external initializer{
        __ERC721A_init("Box","BOX");
        __Ownable_init();
        __ERC721ABurnable_init();
    }


    modifier callerIsUser() {
        require(tx.origin == msg.sender, "Box :: Cannot be called by a contract");
        _;
    }

    function mint(uint256 _quantity) external payable callerIsUser{
        require(publicSale, "Box :: Not Yet Active.");
        require((totalSupply() + _quantity) <= MAX_SUPPLY, "Box :: Beyond Max Supply");
        require(( (_numberMinted(msg.sender)) +_quantity) <= MAX_PUBLIC_MINT, "Box :: Already minted 10 times!");
        // require((adressMint[msg.sender] +_quantity) <= MAX_PUBLIC_MINT, "Box :: Already minted 10 times!");
        require(msg.value >= (PUBLIC_SALE_PRICE * _quantity), "Box :: Payment is below the price ");

        // adressMint[msg.sender] += _quantity;
        _safeMint(msg.sender, _quantity);
    }

    function whitelistMint(bytes32[] memory _merkleProof, uint256 _quantity) external payable callerIsUser{
        require(whiteListSale, "Box :: Minting is on Pause");
        require((totalSupply() + _quantity) <= MAX_SUPPLY, "Box :: Cannot mint beyond max supply");
        // require((adressMint[msg.sender] + _quantity)  <= MAX_WHITELIST_MINT, "Box :: Cannot mint beyond whitelist max mint!");
        require(( (_numberMinted(msg.sender)) + _quantity)  <= MAX_WHITELIST_MINT, "Box :: Cannot mint beyond whitelist max mint!");
        require(msg.value >= (WHITELIST_SALE_PRICE * _quantity), "Box :: Payment is below the price");
        bytes32 sender = keccak256(abi.encodePacked(msg.sender));
        require(MerkleProofUpgradeable.verify(_merkleProof, merkleRoot, sender), "Box :: You are not whitelisted");

        // adressMint[msg.sender] += _quantity;
        _safeMint(msg.sender, _quantity);
    }
    
    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenUri;
    }

    function setTokenUri(string memory _baseTokenUri) external onlyOwner{
        baseTokenUri = _baseTokenUri;
    }
   

    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner{
        merkleRoot = _merkleRoot;
    }

    function getMerkleRoot() external view returns (bytes32){
        return merkleRoot;
    }

    function toggleWhiteListSale() external onlyOwner{
        whiteListSale = !whiteListSale;
    }

    function toggleReveal() external onlyOwner{
        isRevealed = !isRevealed;
    }

    function togglePublicSale() external onlyOwner{
        publicSale = !publicSale;
    }

    function tokenIdsOfOwner(address owner) public view returns (uint256[] memory) {
        unchecked {
            uint256 tokenIdsIdx;
            address currOwnershipAddr;
            uint256 tokenIdsLength = balanceOf(owner);
            uint256[] memory tokenIds = new uint256[](tokenIdsLength);
            TokenOwnership memory ownership;
            for (uint256 i = _startTokenId(); tokenIdsIdx != tokenIdsLength; ++i) {
                ownership = _ownerships[i];
                if (ownership.burned) {
                    continue;
                }
                if (ownership.addr != address(0)) {
                    currOwnershipAddr = ownership.addr;
                }
                if (currOwnershipAddr == owner) {
                    tokenIds[tokenIdsIdx++] = i;
                }
            }
            return tokenIds;
        }
    }

    function mintJack(uint256 _quantity) internal {
        Jack jack = Jack(jack_address);
        jack.mint(msg.sender,_quantity);
    }

    function setJackAddress(address _jack_address) external onlyOwner{
        jack_address = _jack_address;
    }
    
    
    function getJackAddress() external view returns (address){
        return jack_address;
    }

    // function burn(uint256 tokenId) public override callerIsUser{
    //      require( _exists(tokenId), "Box :: Token not minted yet or burnt");
    //     _burn(tokenId, true);
    // }

    function burn(uint256 _quantity) public override callerIsUser{

        uint256[] memory tokenIds = tokenIdsOfOwner(msg.sender);
        require((balanceOf(msg.sender)) >= (_quantity), "Box :: Cannot burned beyond minted tokens");
        for (uint256 i = 0; i < _quantity; i++) {
            // require(ownerOf(tokenIds[i]) ==  (msg.sender) , "Box :: You are not the owner of this token");
            _burn(tokenIds[i], true);
        }

        mintJack(_quantity);
    }
   
    function tokensBurntBy(address owner) external view returns (uint256) {
        return _numberBurned(owner);
    }

    function tokensMintedtBy(address owner) external view returns (uint256) {
        return _numberMinted(owner);
    }


    function withdraw() external onlyOwner{
        payable(msg.sender).transfer(address(this).balance);
    }

    function version() external pure returns (string memory) {
        return "1.0.0";
    }
    
}