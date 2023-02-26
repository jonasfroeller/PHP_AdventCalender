<?php
if (isset($_REQUEST["door"])) {
    echo getIndex($_REQUEST["door"]);
}
function getIndex($i)
{
    if ($i == "rndm") {
        $i = rand(0, 23);
    }
    if ($i <= 23 && $i >= 0) {
        $doorDate = date("Y/m/$i"); // final $doorDate = date("Y/12/$i");
        $diff = ceil((strtotime($doorDate) - time()) / 60 / 60 / 24);
        if ($diff < 0) {
            $doors = array("rndm-20.png", "rndm-0.png", "rndm-1.png", "rndm-2.png", "rndm-3.png", "rndm-4.png", "rndm-5.png", "rndm-21.png", "rndm-6.png", "rndm-7.png", "rndm-8.png", "rndm-9.png", "rndm-10.png", "rndm-11.png", "rndm-22.png", "rndm-12.png", "rndm-13.png", "rndm-14.png", "rndm-15.png", "rndm-16.png", "rndm-17.png", "rndm-18.png", "rndm-19.png", "ChristmasTree-1.png");
        } else {
            return "error";
        }
        return $doors[$i];
    } else {
        return "error";
    }
}
