<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');
header('Access-Control-Allow-Headers: Content-Type');
require 'DB.php';
class cocktails extends DB
{
    /** @var array Global variable for storing the response for any HTTP request. */
    private array $response;

    public function handleRequest(){
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $this->post();
        } else if ($_SERVER["REQUEST_METHOD"] == "GET") {
             $this->get();
        }
    }
    private function post(){
        $creatorID = $_POST['creatorID'];
        $cocktailName = $_POST['cocktailName'];
        $recipe = $_POST['recipe'];
        $image = $_POST['cocktailImage'];
        /** Strip down the base64 strings to replace the data type preface for both accepted image formats. */
        $b64Strip = str_replace("data:image/jpeg;base64,", "", $image);
        $b64Strip = str_replace("data:image/png;base64,", "", $b64Strip);
        /** Decode and recode the POST media content and compare to the original to check it is correct Base64 format,
         */
        if (base64_encode(base64_decode($b64Strip, true)) !== $b64Strip){
            /** Set HTTP response to 400 and return void to end the current script. */
            http_response_code(400);
            return;
        }
        /** Create a unique ID and concatenate it onto a conditional ternary to check if the base64 doesn't have the jpeg tag. */
        $mediaName = uniqid().((strpos($image, 'data:image/jpeg') !== false) ? '.jpg' : '.png');
        /** Create media path from concatenated path to mediaName variable. */
        $mediaPath = '../cocktailImages/community/' . $mediaName;
        /** Store the file contents of the base64 string to the mediaPath variable. */
        file_put_contents($mediaPath, file_get_contents($image));
        $stmt = $this->connect()->prepare('INSERT INTO cocktails (creatorID, cocktailName, recipe, image, category) VALUES (?,?,?,?,?)');
        if (!$stmt->execute(array($creatorID,$cocktailName,$recipe,$mediaName,'community'))){
            $stmt = null;
            http_response_code(500);
        }else{
            $stmt = null;
            /** Set HTTP response to 201. */
            http_response_code(201);
            $this->response['success'] = 'New cocktail successfully created!';
            $this->display();
        }
    }
    private function get(){
        /** Start the SQL PDO query to select all content from sightings table. */
        $stmt = $this->connect()->query('SELECT * FROM cocktails');
        /** Check if there are more than 0 rows in the query result. */
        if ($stmt->rowCount() > 0){
            /** Set HTTP response to 200. */
            http_response_code(200);
            /** While variable as fetch of each row in query table. */
            while($row = $stmt->fetch()){
                /** Set response for each row as JSON array to equivalent value key. */
                $this->response['cocktails'][] = [
                    'cocktailID' => $row['cocktailID'],
                    'creatorID' => $row['creatorID'],
                    'cocktailName' => $row['cocktailName'],
                    'recipe' => $row['recipe'],
                    'image' => $row['image'],
                    'category' => $row['category']
                ];
            }
        }else{
            /** Otherwise, set HTTP response to 204 and response JSON with result key. */
            http_response_code(204);
            $this->response['error'] = 'No results';
        }
        /** Parse response content by calling the display method. */
        $this->display();
        $stmt = null;
    }

    /**
     * The display function is used to echo out either the Get or Post Api response as JSON encoded data.
     */
    private function display()
    {
        echo json_encode($this->response, JSON_PRETTY_PRINT);
    }
}
$cocktails = new cocktails();
$cocktails->handleRequest();
