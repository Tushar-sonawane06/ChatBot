import express from "express";
import passport from "passport";

const router = express.Router();


// START GOOGLE LOGIN
router.get("/google",
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })
);

router.get("/google/callback",

    passport.authenticate("google", {
        failureRedirect: "/login",
        session: true
    }),

    (req, res) => {

        res.redirect("http://localhost:5173");

    }
);

//logout
router.get("/logout", (req, res) => {

    req.logout((err) => {

        if(err) {
            return res.status(500).json({
                error: "Logout failed"
            });
        }

        res.json({
            message: "Logged out successfully"
        });

    });

});


router.get("/me", (req, res) => {

    if(req.isAuthenticated()) {

        return res.json({
            user: req.user
        });

    }

    res.status(401).json({
        user: null
    });

});

export default router;