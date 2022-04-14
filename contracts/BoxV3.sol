// contracts/MyNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "erc721a/contracts/ERC721A.sol";
import "erc721a/contracts/extensions/ERC721ABurnable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";




contract Box is Initializable, ERC721A, ERC721ABurnable ,OwnableUpgradeable{
    uint256 public constant MAX_SUPPLY = 7777;
    uint256 public constant SALE_PRICE = .002 ether;
    string private  baseTokenUri;
    bool public isRevealed;
    bool public whiteListSale;

    bytes32 private merkleRoot;

    mapping(address => uint256) public totalMint;
    
    function initialize() external initializer{
        __ERC721A_init("Box","BOX");
        __Ownable_init();
    }

    modifier callerIsUser() {
        require(tx.origin == msg.sender, "Box :: Cannot be called by a contract");
        _;
    }

    function whitelistMint(bytes32[] memory _merkleProof, uint256 _quantity) external payable callerIsUser{
        require(whiteListSale, "Box :: Minting is on Pause");
        require((totalSupply() + _quantity) <= MAX_SUPPLY, "Box :: Cannot mint beyond max supply");
        require(msg.value >= (SALE_PRICE * _quantity), "Box :: Payment is below the price");
        //create leaf node
        bytes32 sender = keccak256(abi.encodePacked(msg.sender));
        require(MerkleProof.verify(_merkleProof, merkleRoot, sender), "Box :: You are not whitelisted");

        totalMint[msg.sender] += _quantity;
        _safeMint(msg.sender, _quantity);
    }

    function mint(uint256 _quantity) external onlyOwner{
        require((totalSupply() + _quantity) <= MAX_SUPPLY, "Box :: Beyond Max Supply");
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

    function burn(uint256 tokenId) external {
        _burn(tokenId);
    }


    function withdraw() external onlyOwner{
        payable(msg.sender).transfer(address(this).balance);
    }

    function version() external pure returns (string memory) {
        return "1.0.0";
    }
}