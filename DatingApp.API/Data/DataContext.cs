using DatingApp.API.Models;
 using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DataContext:DbContext
    
    {  // 1- crating Class named DataContext and inhreit from Dbcontext Class 
       // 2- Crating constructor 
       // 3- move the options of class DbContext to the constructor of class DataContext by parameters
       // 4- setting the constructor as the base costructor of DataContext Class
    
        public DataContext(DbContextOptions<DataContext> options): base(options)
        {}
       


      
        public DbSet<Value> Values { get; set; }       //Creating property of type Dbset and pass the entity we created "Value"
                                                      //the entityframework  will create a table in my data base called Values 
        public DbSet <User> Users { get; set; }
        
        public DbSet <Photo> Photos { get; set; }

        public DbSet <Like> Likes { get; set; }

        protected override void OnModelCreating(ModelBuilder builder) 
        {
             builder.Entity<Like>()
             .HasKey(K => new {K.LikerId, K.LikeeId});

             builder.Entity<Like>()
             .HasOne(u => u.Likee)
             .WithMany(u =>u.Likers)
             .HasForeignKey(u => u.LikeeId)
             .OnDelete(DeleteBehavior.Restrict);
            
            
             builder.Entity<Like>()
             .HasOne(u => u.Liker)
             .WithMany(u =>u.Likees)
             .HasForeignKey(u => u.LikerId)
             .OnDelete(DeleteBehavior.Restrict);
             

        }

    }   
}

