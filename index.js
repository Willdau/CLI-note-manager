

const fs = require('fs').promises;



async function LoadNotes() {
    try {

        const dataOfNotes = await fs.readFile('note.json', 'utf-8');
        return JSON.parse(dataOfNotes);
        
    } catch {
        return ['ошибка'];
        
    }
};


async function saveNotes(notes) {
    await fs.writeFile('note.json', JSON.stringify(notes));

};


async function main() {
    const args = process.argv.slice(2);
    const command = args[0];


if (!command || command === 'help') {

    console.log(`

        Команды: 

        Add наименование [текст заметки] - добавить новую заметку
        list                             - показать все заметки
        show <id>                        - показать заметку по id
        remove <id>                      - удалить заметку по id
        help                             - помощь/справка

        `);

        return;
};



if (command === 'add') {
    const title = args[1]; 
    const text = args[2] || "";
    const notes = await LoadNotes();

    const newNote = {
    id: notes.length ? notes[notes.length - 1].id + 1 : 1, 
    title,
    text
};

if (!title) {
    console.log("Укажи заголовок/наименование заметки");
    return;
}

notes.push(newNote);
await saveNotes(notes);
console.log('Заметка длбавлена');

};
};



if (command === 'list') {

    const notes = await LoadNotes();

    if (!notes.length) {
        console.log('заметок нет');
        return;

    };
notes.forEach(note => {
    console.log(`${note.id}, ${note.title}`);
    
});
};




if (command === 'show') {

    const id = Number(args[1]);

    if (!id) {
        console.log('непрвльно указан id заметки');
        return;

    };

const notes = await LoadNotes();
const note = notes.find(n => n.id === id);
if (!note) {
    console.log('Нет такой заметки');
    return;

};

console.log(`ID: ${note.id}`);
console.log(`Заголовок: ${note.title}`);
console.log(`Текст заметки: ${note.text}`);

};



if (command === 'remove') {

    const id = Number(args[1]);

    if (!id) {
        console.log('Укажите id заметки');
        return;
               
    };

    let notes = await LoadNotes();
    const initialLength = notes.length;
    notes = notes.filter(n => n.id !== id);
    
    if (notes.length === initialLength) {
        console.log('Такая заметка не найдена');
        return;
    }
    await saveNotes(notes);
    console.log('заметка с ID ${id} удалена');
};


main();


