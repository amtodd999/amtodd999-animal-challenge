const express = require("express");
const router = express.Router();
const { Animal } = require("../models");
// const animalModel = require("../models/animal");
const validateSession = require("../middleware/validate-session");

router.post("/create", validateSession, async (req, res) => {
    let { name, legnumber, predator } = req.body;
    // const {id} = req.user;

    try {
        const newAnimal = await Animal.create({
            name,
            legNumber: legnumber,
            predator,
            user_id: req.user.id,
            // user_id: id
        });
        res.status(201).json({
            anyWordIWantItToBe: newAnimal,
            message: "Animal has been created!",
        });
    } catch (error) {
        res.status(500).json({
            message: `Failed to create animal: ${error}`,
        });
    }
});

router.get("/", validateSession, async (request, response) => {
    try {
        const allAnimals = await Animal.findAll({
            where: { user_id: request.user.id },
        });
        response.status(200).json({ allAnimals });
    } catch (error) {
        response.status(500).json({
            error: `You have an error: ${error}`,
        });
    }
});

router.delete("/delete/:name", validateSession, async (req, res) => {
    // router.delete("/delete/:id", async (req, res) => {
    // const animalId = req.params.id;
    // await Animal.destroy({where: {id: animalId}})
    const animalToDelete = req.params.name;
    try {
        let animal = await Animal.findOne({
            where: {
                name: animalToDelete,
                user_id: req.user.id,
            },
        });

        if (animal) {
            const query = {
                where: {
                    id: animal.id,
                    user_id: req.user.id,
                },
            };

            await Animal.destroy(query);

            res.status(200).json({
                message: `This animal ${animalToDelete} has been deleted`,
            });
        } else {
            res.status(200).json({
                message: "Animal not found",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: `There was an issue deleting this animal: ${error}`,
            error,
        });
    }
});

router.put("/update/:id", validateSession, async (req, res) => {
    const { name, legNumber, predator } = req.body.animal;

    const query = {
        where: {
            id: req.params.id,
            user_id: req.user.id,
        },
    };

    const updatedAnimal = {
        name: name,
        legNumber: legNumber,
        predator: predator,
    };

    try {
        const update = await Animal.update(updatedAnimal, query);
        res.status(200).json({
            message: "Animal mutated!",
            update,
        });
    } catch (error) {
        res.status(500).json({
            message: `SomEThInG wEnt WroNg!`,
        });
    }
});

module.exports = router;