<?php
header('Access-Control-Allow-Origin: localhost');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
require 'DB.php';
class cocktails extends DB
{
    /** @var array Global variable for storing the response for any HTTP request. */
    private array $response;

    public function handleRequest(){
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            echo '';
        } else if ($_SERVER["REQUEST_METHOD"] == "GET") {
             $this->get();
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
