<?php
 $fname = $_GET['firstname'];
      if($fname=='Jeff')
      {
          //header("Content-Type: application/json");
		  //組成 $_GET['callback']({'fullname':'Jeff Hansen'})
         echo $_GET['callback'] . '(' . "{'fullname' : 'Jeff Hansen'}" . ')';

      }
?>