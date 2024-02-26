const express = require('express');
const { Book, Member, Circulation } = require('../model/db');
const router = express.Router();

router.get("/", (req,res)=>{
    res.send("App is listening");
})

router.post('/checkout', async(req,res) => {
    const { memberId, bookId } = req.body;
    try {
        const book = await Book.findById(bookId);
        if(!book || book.numberOfCopies<1){
            return res.status(404).json({error:"Book unavailable"});
        }

        const member = await Member.findById(memberId);
        if(!member){
            return res.status(404).json({error:"Member not found"});
        }

        const circulation = new Circulation({
            book:bookId,
            member:memberId,
        });

        await circulation.save();

        book.numberOfCopies-=1;
        await book.save();
        res.status(200).json({message: "Book checkout is successful"})
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal server error"});
    }
})

router.post('/return', async (req,res) => {
    const { bookId, memberId } = req.query;
    try {
        const circulationRec = await Circulation.findOne({ book:bookId, member:memberId});

        if(!circulationRec){
            return res.status(404).json({error:"Circulation record not found"});
        }

        circulationRec.returned = true;
        const today = new Date();
        if(circulationRec.dueDate<today){
            const datediff = today.getTime() - circulationRec.dueDate.getTime();
            const days = Math.ceil(datediff/ (1000 * 3600 * 24));
            const fine = days*50;
            circulationRec.fineAmount = fine;
        }
        await circulationRec.save();
        res.status(200).json({message:" Book received successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal server error"});
    }
})

router.get('/overdue-books/:memberId', async(req,res) => {
    const memberId = req.params.memberId;
    try {
        const memberCirculation = await Circulation.find({ member:memberId, returned:false});
        const overdueBooks = memberCirculation.filter(circulation => circulation.dueDate < new Date());
        res.status(200).json({overdueBooks});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Inernal server error"});
    }
})

router.get('/overdue-fine/:memberId', async(req,res) => {
    const memberId = req.params.memberId;
    try {
        const memberCirculation = await Circulation.find({member:memberId, returned:false});
        let totalFine = 0;
        memberCirculation.forEach(circulation => {
            if(circulation.dueDate < new Date()){
                totalFine += circulation.fineAmount;
            }
        });
        res.status(200).json({ totalFine });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server error"});
    }
})

router.post('/member', async(req,res) => {
    const {memberid,membername,bookid,bookname,copies} = req.body;
    const newMember = new Member({
        memberId:memberid,
        memberName:membername        
    })
    await newMember.save();
    const newBook = new Book({
        bookId:bookid,
        bookName:bookname,
        numberOfCopies:copies
    })
    await newBook.save();
    res.status(201).json({message: "New entries created"});
})

router.get('/books', async(req,res) => {
    try {
        const books = await Book.find();
        res.status(200).json({books});
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal server error"});
    }
})

module.exports = router