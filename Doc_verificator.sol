pragma solidity ^0.4.24;
contract Doc_verificator{
    struct student{
        mapping (int => string) stoc;
    }
    mapping (int => student) students;
    function newstudent (int _s_id,int _c_id,string memory _doc_hash) public{
        students[_s_id].stoc[_c_id]=_doc_hash;
    } 
    function getstud (int _s_id,int _c_id,string memory _doc_hash) view public returns (bool){
        bytes memory a = bytes(students[_s_id].stoc[_c_id]);
        bytes memory b = bytes(_doc_hash);
        if (a.length != b.length)
            return false;
        for (uint i = 0; i < a.length; i ++)
            if (a[i] != b[i])
                return false;
        return true;
}
}