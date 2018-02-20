import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send('GET: Sample Route');
});

export const isPalindrome=(input)=>{
  if(input.length>0){
    let actual=input;
    let reverse=[...input].reverse().join('');
     return reverse==actual
  }
else throw new Error("Please enter string");
}

export default router;
