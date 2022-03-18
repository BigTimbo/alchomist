<?php
header('Access-Control-Allow-Origin: localhost');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require 'DB.php';
class users extends DB
{
    /** @var array Global variable for storing the response for any HTTP request. */
    protected array $response;
    private string $userName;
    private string $email;
    private string $pass;
    private string $passRpt;
    function handleRequest(){
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            if (!empty($_POST['userName']) && !empty($_POST['email']) && !empty($_POST['pass']) && !empty($_POST['passRpt'])){
                $this->signUp($_POST['userName'], $_POST['email'], $_POST['pass'], $_POST['passRpt']);
            }else if (!empty($_POST['email']) && !empty($_POST['pass'])){
                $this->logIn($_POST['email'], $_POST['pass']);
            }
        }
//        else if ($_SERVER["REQUEST_METHOD"] == "GET") {
//            $this->get();
//        }
    }
    private function signUp($userName, $email, $pass, $passRpt): void
    {
        $this->userName = $userName;
        $this->email = $email;
        $this->pass = $pass;
        $this->passRpt = $passRpt;
        if ($this->invalidUserName() === false) {
            $this->response['error'] = 'Invalid Username.';
            $this->display();
            http_response_code(400);
            return;
        }
        if ($this->invalidPass() === false){
            $this->response['error'] = 'Invalid Password.';
            $this->display();
            http_response_code(400);
            return;
        }
        if ($this->invalidEmail() === false) {
            $this->response['error'] = 'Invalid Email.';
            $this->display();
            http_response_code(400);
            return;
        }
        if ($this->pwdMatch() === false) {
            $this->response['error'] = 'Passwords do not match.';
            $this->display();
            http_response_code(400);
            return;
        }
        if ($this->emailInUse() === false) {
            $this->response['error'] = 'Email already in use.';
            $this->display();
            http_response_code(409);
            return;
        }
        $this->setUser($this->userName, $this->email, $this->pass);
    }

    private function invalidUserName(): bool{
        $userNameRegex = '/(?=.{1,12}$)^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/';
        if (preg_match($userNameRegex, $this->userName)){
            $result = true;
        }else{
            $result = false;
        }
        return $result;
    }

    private function invalidPass(): bool{
        $passRegex = '/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/';
        if (preg_match($passRegex, $this->pass) || preg_match($passRegex, $this->passRpt)){
            $result = true;
        }else{
            $result = false;
        }
        return $result;
    }

    private function invalidEmail(): bool{
        if (!filter_var($this->email, FILTER_VALIDATE_EMAIL)){
            $result = false;
        }else{
            $result = true;
        }
        return $result;
    }

    private function pwdMatch(): bool{
        if ($this->pass !== $this->passRpt){
            $result = false;
        }else{
            $result = true;
        }
        return $result;
    }
    private function emailInUse(): bool{
        if (!$this->checkUser($this->email)){
            $result = false;
        }else{
            $result = true;
        }
        return $result;
    }

    protected function checkUser($email): bool{
        $stmt = $this->connect()->prepare('SELECT email FROM users WHERE email = ?;');
        if (!$stmt->execute(array($email))){
            $stmt = null;
            http_response_code(500);
        }
        if ($stmt->rowCount() > 0){
            $resultCheck = false;
        }else{
            $resultCheck = true;
        }
        return $resultCheck;
    }
    protected function setUser($userName, $email, $pass){
        $stmt = $this->connect()->prepare('INSERT INTO users (userName, email, password) VALUES (?,?,?);');
        $hashedPass = password_hash($pass, PASSWORD_DEFAULT);
        if (!$stmt->execute(array($userName,$email, $hashedPass))){
            $stmt = null;
            http_response_code(500);
        }else{
            $stmt = null;
            $this->response['success'] = 'New account successfully created!';
            $this->display();
        }
    }

    private function logIn($email, $pass){
        $this->email = $email;
        $this->pass = $pass;
        if ($this->validateInput()){
            $this->response['error'] = 'Invalid Password.';
            http_response_code(400);
        }else{
            $this->getUser($this->email, $this->pass);
        }
    }
    private function validateInput(): bool
    {
        $passRegex = '/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/';
        if (!filter_var($this->email, FILTER_VALIDATE_EMAIL) || preg_match($passRegex, $this->pass)){
            $result = false;
        }else{
            $result = true;
        }
        return $result;
    }
    private function getUser($email, $pass)
    {
        $stmt = $this->connect()->prepare('SELECT password FROM users WHERE email = ?;');
        if (!$stmt->execute(array($email))){
            $stmt = null;
            http_response_code(500);
        }
        if ($stmt->rowCount() === 0){
            $stmt = null;
            http_response_code(204);
        }else{
            $passHashed = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $checkPass = password_verify($pass, $passHashed[0]["password"]);
            if ($checkPass === false){
                $stmt = null;
                $this->response['error'] = 'Wrong Password.';
                http_response_code(400);
            }else{
                $stmt = $this->connect()->prepare('SELECT * FROM users WHERE email = ?;');
                if (!$stmt->execute(array($email))){
                    $stmt = null;
                    http_response_code(500);
                }
                if ($stmt->rowCount() === 0){
                    $stmt = null;
                    http_response_code(204);
                }
                $user = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $this->response['userID'] = $user[0]['userID'];
                $this->response['userName'] = $user[0]['userName'];
                $this->response['preferences'] = $user[0]['preferences'];
                $stmt = null;
            }
        }
        /** Parse response content by calling the display method. */
        $this->display();
    }
    /**
     * The display function is used to echo out either the Get or Post Api response as JSON encoded data.
     */
    private function display()
    {
        echo json_encode($this->response, JSON_PRETTY_PRINT);
    }
}
$users = new users();
$users->handleRequest();
