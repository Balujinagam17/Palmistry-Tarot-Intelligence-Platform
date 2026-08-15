class PalmInterpreter:
    """
    Generates a detailed palmistry interpretation based on
    extracted features and classified palm lines.
    """

    @staticmethod
    def interpret(features, classified_lines):

        report = {}

        # -----------------------
        # Palm Shape
        # -----------------------
        palm_shape = features.get("palm_shape", "Unknown")

        if palm_shape == "Square":
            report["personality"] = (
                "Practical, disciplined, hardworking, and reliable."
            )

        elif palm_shape == "Long":
            report["personality"] = (
                "Creative, emotional, imaginative, and intuitive."
            )

        else:
            report["personality"] = (
                "Balanced personality with adaptable nature."
            )

        # -----------------------
        # Heart Line
        # -----------------------
        heart_count = len(classified_lines.get("heart_line", []))

        if heart_count > 0:
            report["love"] = (
                "Strong emotional intelligence and caring relationships."
            )
        else:
            report["love"] = (
                "Heart line not clearly visible."
            )

        # -----------------------
        # Head Line
        # -----------------------
        head_count = len(classified_lines.get("head_line", []))

        if head_count > 0:
            report["intelligence"] = (
                "Logical thinker with good analytical ability."
            )
        else:
            report["intelligence"] = (
                "Unable to determine thinking style."
            )

        # -----------------------
        # Life Line
        # -----------------------
        life_count = len(classified_lines.get("life_line", []))

        if life_count > 0:
            report["health"] = (
                "Good vitality and energetic lifestyle."
            )
        else:
            report["health"] = (
                "Life line not clearly detected."
            )

        # -----------------------
        # Fate Line
        # -----------------------
        fate_count = len(classified_lines.get("fate_line", []))

        if fate_count > 0:
            report["career"] = (
                "Career-focused personality with determination."
            )
        else:
            report["career"] = (
                "Career path may involve several changes."
            )

        # -----------------------
        # Overall Summary
        # -----------------------
        report["summary"] = (
            "Palm analysis completed successfully."
        )

        return report