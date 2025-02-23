import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Edit } from "lucide-react";

export default function BookListApp() {
  const [booksToRead, setBooksToRead] = useState([]);
  const [booksRead, setBooksRead] = useState([]);
  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [notes, setNotes] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editRead, setEditRead] = useState(false);
  const [readDate, setReadDate] = useState("");

  useEffect(() => {
    const savedBooksToRead = JSON.parse(localStorage.getItem("booksToRead")) || [];
    const savedBooksRead = JSON.parse(localStorage.getItem("booksRead")) || [];
    setBooksToRead(savedBooksToRead);
    setBooksRead(savedBooksRead);
  }, []);

  useEffect(() => {
    localStorage.setItem("booksToRead", JSON.stringify(booksToRead));
    localStorage.setItem("booksRead", JSON.stringify(booksRead));
  }, [booksToRead, booksRead]);

  const addOrUpdateBook = () => {
    if (!bookName || !author || !category || !recommendation || !notes) return;
    const newBook = { bookName, author, category, recommendation, notes, readDate: editRead ? readDate : null };
    if (editIndex !== null) {
      if (editRead) {
        const updatedBooks = [...booksRead];
        updatedBooks[editIndex] = newBook;
        setBooksRead(updatedBooks);
      } else {
        const updatedBooks = [...booksToRead];
        updatedBooks[editIndex] = newBook;
        setBooksToRead(updatedBooks);
      }
      setEditIndex(null);
    } else {
      setBooksToRead([...booksToRead, newBook]);
    }
    resetForm();
  };

  const resetForm = () => {
    setBookName("");
    setAuthor("");
    setCategory("");
    setRecommendation("");
    setNotes("");
    setReadDate("");
    setEditIndex(null);
    setEditRead(false);
  };

  const markAsRead = (index) => {
    const book = booksToRead[index];
    book.readDate = new Date().toLocaleDateString();
    setBooksToRead(booksToRead.filter((_, i) => i !== index));
    setBooksRead([...booksRead, book]);
  };

  const deleteBook = (index, isRead) => {
    if (isRead) {
      setBooksRead(booksRead.filter((_, i) => i !== index));
    } else {
      setBooksToRead(booksToRead.filter((_, i) => i !== index));
    }
  };

  const editBook = (index, isRead) => {
    const book = isRead ? booksRead[index] : booksToRead[index];
    setBookName(book.bookName);
    setAuthor(book.author);
    setCategory(book.category);
    setRecommendation(book.recommendation);
    setNotes(book.notes);
    setReadDate(book.readDate || "");
    setEditIndex(index);
    setEditRead(isRead);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Lista de Livros</h1>
      <Input placeholder="Nome do Livro" value={bookName} onChange={(e) => setBookName(e.target.value)} />
      <Input placeholder="Autor" value={author} onChange={(e) => setAuthor(e.target.value)} className="mt-2" />
      <Input placeholder="Categoria" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-2" />
      <Input placeholder="Indicação" value={recommendation} onChange={(e) => setRecommendation(e.target.value)} className="mt-2" />
      <Input placeholder="Notas" value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-2" />
      {editRead && <Input placeholder="Data de Leitura" value={readDate} onChange={(e) => setReadDate(e.target.value)} className="mt-2" />}
      <Button onClick={addOrUpdateBook} className="mt-4 w-full">{editIndex !== null ? "Atualizar Livro" : "Adicionar Livro"}</Button>
      
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Livros para Ler</h2>
        {booksToRead.map((book, index) => (
          <Card key={index} className="mb-2">
            <CardContent>
              <p><strong>{book.bookName}</strong> - {book.author}</p>
              <p>Categoria: {book.category}</p>
              <p>Indicação: {book.recommendation}</p>
              <p>Notas: {book.notes}</p>
              <Button onClick={() => markAsRead(index)} className="mt-2">Marcar como Lido</Button>
              <Button onClick={() => editBook(index, false)} className="ml-2"><Edit size={16} /></Button>
              <Button onClick={() => deleteBook(index, false)} className="ml-2"><Trash2 size={16} /></Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Livros Lidos</h2>
        {booksRead.map((book, index) => (
          <Card key={index} className="mb-2">
            <CardContent>
              <p><strong>{book.bookName}</strong> - {book.author}</p>
              <p>Categoria: {book.category}</p>
              <p>Indicação: {book.recommendation}</p>
              <p>Notas: {book.notes}</p>
              <p className="text-sm text-gray-600">Lido em: {book.readDate}</p>
              <Button onClick={() => editBook(index, true)} className="ml-2"><Edit size={16} /></Button>
              <Button onClick={() => deleteBook(index, true)} className="ml-2"><Trash2 size={16} /></Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
document.getElementById("form-livro").addEventListener("submit", function(event) {
  event.preventDefault();

  let titulo = document.getElementById("titulo").value;
  let autor = document.getElementById("autor").value;
  let categoria = document.getElementById("categoria").value;
  let indicacao = document.getElementById("indicacao").value;
  let notas = document.getElementById("notas").value;

  let livroItem = document.createElement("li");
  livroItem.innerHTML = `${titulo} - ${autor} 
      <button onclick="marcarComoLido(this)">Lido</button>
      <button onclick="removerLivro(this)">🗑️</button>`;

  document.getElementById("lista-livros").appendChild(livroItem);

  document.getElementById("form-livro").reset();
});

function marcarComoLido(botao) {
  let livroItem = botao.parentElement;
  botao.remove();  
  document.getElementById("lista-lidos").appendChild(livroItem);
}

function removerLivro(botao) {
  botao.parentElement.remove();
}
