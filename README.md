# csv-buffer-read-with-indexing

##  System Design
For this reearch there is some core design for this system
### Summarization
For accessing a portofolio based on time fast, i design a summarization of the transactions.csv in indexing_summary.ts

### Indexing
We need access the summary as fast as possible so, i design a data of summarization with some specific length of byte. With that design when i need specific data in some row i can access it without need loop it one by one.
 
### Searching
Use binary search tree for searching method of summary data when search specific timestamp that we need, beacuse of the algorithm we get best case of O(1) and worst-case lookup of O(log n)

##  How To Use
  Download transaction.csv, after that use indexing_summary.ts for create a summary. After the process the file will moved to archived, so in the next time if its another file, we can use indexing_summary.ts again
   
   After that we can use get_data.ts to get the data
   
## Limitations
  Because binary search tree use the sorted data, so the limitations its a transactions.csv always sorted ascending by timestamps
