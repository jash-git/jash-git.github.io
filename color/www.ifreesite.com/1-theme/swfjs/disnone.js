  function webyesnonelink(num){
  for(var id = 1;id<=7;id++)
  {
  var MrJin="webyesnone_ids"+id;
  if(id==num)
  document.getElementById(MrJin).style.display="block";
  else
  document.getElementById(MrJin).style.display="none";
  }
  if(num==1) 
  document.getElementById("webyesnonetitle").className="";
  if(num==2)
  document.getElementById("webyesnonetitle").className="";
  if(num==3)
  document.getElementById("webyesnonetitle").className="";
  if(num==4)
  document.getElementById("webyesnonetitle").className="";
  if(num==5)
  document.getElementById("webyesnonetitle").className="";
  if(num==6)
  document.getElementById("webyesnonetitle").className="";
  if(num==7)
  document.getElementById("webyesnonetitle").className="";
  }
/* 7數成立 */