<?php
/**
 * @author Tim Amis <t.amis1@uni.brighton.ac.uk>
 * @see {@link https://github.com/BigTimbo/zapApp}
 */
class DB
{
    /**
     * Connect method used to initialise a PDO SQL connection to my database.
     * @return bool|int|PDO PDO object or HTTP response.
     */
    protected function connect()
    {
        try {
            /** Brighton Domains connection details. */
//            $host = 'brighton';
//            $user = 'ta459';
//            $pwd = '!University-03841480';
//            $dbName = 'ta459_CI609_Assignment';
            /** Localhost connection details. */
            $host = 'localhost';
            $user = 'root';
            $pwd = '';
            $dbName = 'alchomist';
            /** Return a PDO connection to database. */
            return new PDO('mysql:host=' . $host . ';dbname=' . $dbName . ';charset=utf8mb4', $user, $pwd);
        } catch (Exception $e) {
            /** Catch the PDO connection errors, printing the error message and returning the HTTP response 500. */
            print "Connection failed: " . $e->getMessage();
            return http_response_code(500);
        }
    }
}
