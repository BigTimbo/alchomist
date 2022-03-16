<?php
require 'DB.php';
class users extends DB
{
    function handleRequest(){
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
//            $this->post();
        } else if ($_SERVER["REQUEST_METHOD"] == "GET") {
//            $this->get();
        }
        echo 'poo';
    }
}
$users = new users();
$users->handleRequest();
