const { UniqueConstraintError } = require("sequelize/lib/errors");
const express = require("express");
const router = express.Router();
const { Animal } = require("../models");

//Create an animal
router.post("/create", async (req,res) => {

    let { name, legNumber, predator } = req.body.animal;
    try {
        const newAnimal = await Animal.create({
            name,
            legNumber,
            predator
        });
        res.status(201).json({
            message: "animal is created",
            animal: newAnimal
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "duplicate animal",
            });
        } else {
            res.status(500).json({
                message: "Failed to create animal",
            });
        }
    }
});

//Get All Animals
router.get("/", async (req, res) => {
    try {
        const allAnimals = await Animal.findAll();
        res.status(200).json(allAnimals);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

//Delete an Animal
router.delete("/delete/:id", async (req, res) => {
    const animalId = req.params.id;

    try {
        const query = {
            where: {
                id: animalId
            }
        };
        await Animal.destroy(query);
        res.status(200).json({ message: "Animal has been deleted from db" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

//Update an Animal
router.put("/update/:id", async (req, res) => {
    const { name, legNumber, predator } = req.body.animal;
    const animalId = req.params.id;

    const query = {
        where: {
            id: animalId
        }
    };

    const updatedAnimal = {
        name: name,
        legNumber: legNumber,
        predator: predator
    };

    try {
        const update = await Animal.update(updatedAnimal, query);
        res.status(200).json({message: "Your update was processed"});
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

module.exports = router;