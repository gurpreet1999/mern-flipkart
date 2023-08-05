class ApiFeatures {
    constructor(query, queryStr) {
     
      this.query = query;
      this.queryStr = queryStr;

     
    }
  
    search() {
      const keyword = this.queryStr.keyword
        ? {
            name: {
              $regex: this.queryStr.keyword,
              $options: "i",
            },
          }
        : {};
  
      this.query = this.query.find({ ...keyword });
    
      return this;
    }
  
    filter() {
      const queryCopy = { ...this.queryStr };
      
      //   Removing some fields for category
      const removeFields = ["keyword", "page", "limit"];
  
      removeFields.forEach((key) => delete queryCopy[key]);
  
      // Filter For Price and Rating
  
      let queryStr = JSON.stringify(queryCopy);

     
      queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

      console.log(JSON.parse(queryStr))
     
      this.query = this.query.find(JSON.parse(queryStr));
  
      return this;
    }
  
    pagination(resultPerPage) {
      const currentPage = Number(this.queryStr.page) || 1;
  
      const skip = resultPerPage * (currentPage - 1);

  //if page is 3 then we have to skip 8*25=16

  // 24-16
  //har page me 8 product ayega -- so in 3rd page we have to skip 16 8+8
  
  //this.query --product.find() hi he ----isme mene limit and skip method laga diya he 

      this.query = this.query.limit(resultPerPage).skip(skip);
  
      return this;
    }
  }
  
  module.exports = ApiFeatures;