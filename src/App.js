import "./App.css";
import { Form, Button, Container, Card, ListGroup } from "react-bootstrap";
import * as React from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  text: yup
    .string()
    .trim()
    .required()
    .test("isAlphabets", "Must be alphabets", (value) => {
      return /^[a-zA-Z]+$/.test(value);
    }),
});

function App() {
  const [words, setWords] = React.useState([]);
  const [anagrams, setAnagrams] = React.useState([]);

  const readFile = async () => {
    const res = await fetch(
      "https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt"
    );
    const text = await res.text();
    setWords(text.split("\r\n").sort((x, y) => x.length - y.length));
  };

  React.useEffect(() => {
    readFile();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  /**
   * Check for anagram
   * @param {String} word1
   * @param {String} word2
   * @returns {Boolean}
   */
  const isAnagram = (word1, word2) => {
    const charArray1 = word1.split("");
    const charArray2 = word2.split("");

    if (charArray1.length !== charArray2.length) return false;

    charArray1.sort();
    charArray2.sort();

    for (let i = 0; i < charArray1.length; i++)
      if (charArray1[i] !== charArray2[i]) return false;

    return true;
  };

  const findAnagrams = (text) => {
    const array = [];

    for (let i = 0; i < words.length; i++) {
      if (words[i].length < text.length) {
        continue;
      }
      if (words[i].length === text.length && isAnagram(words[i], text)) {
        array.push(words[i]);
      }

      if (words[i].length > text.length) {
        break;
      }
    }

    setAnagrams(array);
  };

  const onSubmit = (data) => {
    findAnagrams(data.text);
  };

  return (
    <Container className="mt-3">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group>
          <Form.Label>Input</Form.Label>
          <Form.Control
            {...register("text")}
            type="text"
            placeholder="Enter text"
            isInvalid={!!errors.text}
            autoComplete="off"
          />
          <Form.Control.Feedback type="invalid">
            {errors?.text?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" className="my-3">
          Submit
        </Button>
      </Form>

      <Card>
        <Card.Body>
          <Card.Title>Anagrams: {String(anagrams.length)}</Card.Title>
          <ListGroup>
            {anagrams.map((anagram) => (
              <ListGroup.Item key={anagram}>{anagram}</ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default App;
