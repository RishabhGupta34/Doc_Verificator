pragma solidity ^0.4.24;
contract Doc_verificator{
    struct student{
        string s_name;
        string s_id;
        string c_id;
        string doc_hash;
        string c_name;
    }
    function strConcat(string memory _a, string memory _b) public returns (string memory){ 
    bytes memory _ba = bytes(_a); 
    bytes memory _bb = bytes(_b);
    string memory abcde = new string(_ba.length + _bb.length); 
    bytes memory concatstr = bytes(abcde); 
    uint k = 0; 
    for (uint i = 0; i < _ba.length; i++) concatstr[k++] = _ba[i]; 
    for (uint i = 0; i < _bb.length; i++) concatstr[k++] = _bb[i]; 
    return string(concatstr); 
    } 
    function stringsEqual(string memory _a, string memory _b) public returns (bool) {
		bytes memory a = bytes(_a);
		bytes memory b = bytes(_b);
		if (a.length != b.length)
			return false;
		for (uint i = 0; i < a.length; i ++)
			if (a[i] != b[i])
				return false;
		return true;
	}
    mapping (string => student) private stud;
    function newstudent (string memory _s_name,string memory _s_id,string memory _c_id,string memory _doc_hash,string memory _c_name) public{
        string memory _index=strConcat(_s_id,_c_id);
        stud[_index].s_name=_s_name;
        stud[_index].s_id=_s_id;
        stud[_index].c_id=_c_id;
        stud[_index].c_name=_c_name;
        stud[_index].doc_hash=_doc_hash;
    } 
    function getstud (string memory _s_id,string memory _c_id,string memory _doc_hash) public returns (string memory){
        string memory _index=strConcat(_s_id,_c_id);
        if(stringsEqual(stud[_index].doc_hash,_doc_hash)){
            return ("true");}
        else{
            return ("false");}
    }
}
