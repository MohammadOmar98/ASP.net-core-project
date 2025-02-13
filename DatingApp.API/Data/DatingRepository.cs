using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _context;
        public DatingRepository(DataContext context)
        {
            _context = context;

        }
        public void Add<T>(T entity) where T : class
        {
           _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
           _context.Remove(entity);
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes.FirstOrDefaultAsync(u =>u.LikerId == userId && u.LikeeId == recipientId);
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            return await _context.Photos
            .Where(u => u.UserId ==userId).FirstOrDefaultAsync(p =>p.IsMain);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var Photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);
            return Photo;
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(p =>p.Photos)
            .FirstOrDefaultAsync(u => u.Id == id);
            return user;
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
           var user =  _context.Users.Include(p =>p.Photos).OrderByDescending(u => u.LastActive).AsQueryable();
           
           user  = user.Where(u => u.Id != userParams.UserId) ;

           user  = user.Where(u => u.Gender == userParams.Gender ) ;

           if (userParams.Likers)
           {
                 var UserLikers = await GetUserLikes(userParams.UserId,userParams.Likers);
                 user = user.Where(u => UserLikers.Contains(u.Id));
           }

           if (userParams.Likees)
           {
                var UserLikees = await GetUserLikes(userParams.UserId,userParams.Likers);
                 user = user.Where(u => UserLikees.Contains(u.Id));
           }

           if(userParams.MinAge !=18 || userParams.MaxAge!=99)
           {
               var minDob = DateTime.Today.AddYears(-userParams.MaxAge-1);
               var maxDob = DateTime.Today.AddYears(-userParams.MinAge);

               user = user.Where(u =>u.DateOfBirth >=minDob && u.DateOfBirth<= maxDob);
           }

           if(!string.IsNullOrEmpty(userParams.OrderBy))
           {
               switch (userParams.OrderBy) {
                   case "created":
                   user=user.OrderByDescending(u =>u.Created);
                   break;
                   default: 
                   user = user.OrderByDescending(u =>u.LastActive);
                   break;
               }
           }


            
            return await PagedList<User>.CreateAsync(user ,userParams.PageNumber,userParams.PageSize);
        }

        public async Task<IEnumerable<int>> GetUserLikes(int id, bool Likers)
        {
            var user = await _context.Users
            .Include(x =>x.Likers)
            .Include(x =>x.Likees)
            .FirstOrDefaultAsync(u => u.Id == id);
            if(Likers)
            {
                return user.Likers.Where(u=>u.LikeeId == id).Select(i=>i.LikerId);
            }
            else
            {
                return user.Likees.Where(u=>u.LikerId == id).Select(i=>i.LikeeId);

            }
        }
        public async Task<bool> SaveAll()
        {
           return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Message> GetMessage(int id)
        {
           return await _context.Messages.FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            var messages = _context.Messages
            .Include(u => u.Sender)
            .ThenInclude(p=>p.Photos)
            .Include(u=>u.Recipient)
            .ThenInclude(p=>p.Photos)
            .AsQueryable();

            switch (messageParams.MessageContainer)
            {
                case  "Inbox":
                messages =messages.Where(u => u.RecipientId == messageParams.UserId && u.RecipientDeleted == false );
                break;
                case "OutBox":
                messages = messages.Where(u =>u.SenderId == messageParams.UserId && u.senderDeleted == false );
                break;
                default:
                messages = messages.Where(u => u.RecipientId ==messageParams.UserId && u.RecipientDeleted == false && u.IsRead == false);
                break;
            }

            messages = messages.OrderByDescending(d => d.MessageSent);
            return await PagedList<Message>.CreateAsync(messages,messageParams.PageNumber
            ,messageParams.PageSize);
        }

        public async Task<IEnumerable<Message>> GetMessageThreaad(int userId, int recipientId)
        {
             var messages = await  _context.Messages
            .Include(u => u.Sender)
            .ThenInclude(p=>p.Photos)
            .Include(u=>u.Recipient)
            .ThenInclude(p=>p.Photos)
            .Where(m => m.RecipientId == userId && m.RecipientDeleted == false && m.SenderId == recipientId 
            || m.RecipientId == recipientId && m.SenderId == userId && m.senderDeleted == false)
            .OrderByDescending(m => m.MessageSent)
            .ToListAsync();

            return messages;
        }
    }
}