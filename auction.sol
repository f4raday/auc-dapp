pragma solidity ^0.4.17;


contract Auction {
    
    
    struct Lot {
        uint id;
        address holder;
        address leader;
        bytes32 description;
        uint currentPrice;
        //bool isOpened; 
        uint buyOutPrice;
        uint lastBlock;
        bool withdrawn;
    }
    
    uint private counter = 0;
    
    Lot[] lots;

    
    function Auction() public {}


    function OpenStatus(uint id) private constant returns(bool) {
        if(lots[id].currentPrice<lots[id].buyOutPrice && lots[id].lastBlock > block.number)
            return true;
        else {
            return false;
        }
    }
    
    function EstimatedTimeToFinish(uint id) public constant returns(uint) {
        if(lots[id].lastBlock>block.number)
            return (lots[id].lastBlock-block.number) * 14;
        else 
            return 0;
    }
    
    function CurretBlock() public constant returns(uint) {
        return block.number;
    }
   
    modifier LotOpened(uint id) {
        require(OpenStatus(id));
        _;
    }
    
    modifier costs(uint _amount) {
        require((msg.value / 1 finney) >= _amount);
        _;
    }
    
    event NewLot(uint id);
    
    event NewBid(uint id);
    
    function AddLot(bytes32 description, uint minPrice, uint buyOutPrice, uint endBlock) payable costs(minPrice) public {
        lots.push(Lot(
            counter,
            msg.sender,
            msg.sender,
            description,
            minPrice,
            //true,
            buyOutPrice,
            endBlock,
            false
        ));
        NewLot(counter);
        counter = counter + 1; 
    }
    
    function WithdrawLot(uint id) public payable {
        Lot storage lot = lots[id];
        require(lot.holder == msg.sender);
        require(!OpenStatus(id));
        require(!lot.withdrawn);
        
        lot.holder.send(lot.currentPrice * 1 finney);
        lot.withdrawn = true;
    }
    
    
    function MakeBid(uint id) LotOpened(id) costs(lots[id].currentPrice) payable public {
        
        Lot storage lot = lots[id];
        lot.leader.send(lot.currentPrice * 1 finney);
        
        lot.leader = msg.sender;
        lot.currentPrice = msg.value / 1 finney;
        
        if(lot.currentPrice>=lot.buyOutPrice) {
            //CloseLotOnBuyOut(id);
            lot.holder.send(lot.currentPrice * 1 finney);
            lot.withdrawn = true;
        }
        
        NewBid(id);
    }
   
    
    function GetLot(uint id) constant public returns(uint, address, address, bytes32, uint, uint, bool, uint, bool) {
        Lot storage l = lots[id];
        uint timeLeft = EstimatedTimeToFinish(id);
        return (id, l.holder, l.leader, l.description, l.currentPrice, l.buyOutPrice, OpenStatus(l.id), timeLeft, l.withdrawn);
    }
    
    function GetLotsCount() constant public returns(uint) { 
        return counter;
    }
    
    
    function CloseLot(uint id) public { 
        require(!OpenStatus(id));
        Lot storage lot = lots[id];
        require(lot.holder == msg.sender);
        require(lot.currentPrice<lot.buyOutPrice);
        lot.holder.send(lot.currentPrice * 1 finney);
    }
    
    
    function bytes32ToString(bytes32 x) private returns (string) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }
       
}
