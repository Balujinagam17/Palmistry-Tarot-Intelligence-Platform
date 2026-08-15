class LineClassifier:
    """
    Classify detected palm lines based on their position.
    """

    @staticmethod
    def classify(lines, image_height):
        result = {
            "heart_line": [],
            "head_line": [],
            "life_line": [],
            "fate_line": [],
            "unknown": []
        }

        if not lines:
            return result

        for line in lines:
            y_avg = (line["y1"] + line["y2"]) / 2

            if y_avg < image_height * 0.30:
                result["heart_line"].append(line)

            elif y_avg < image_height * 0.55:
                result["head_line"].append(line)

            elif y_avg < image_height * 0.80:
                result["life_line"].append(line)

            else:
                result["fate_line"].append(line)

        return result