using KnockoutMVC.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace KnockoutMVC.Controllers
{
    public class ImageController : ApiController
    {
        public HttpResponseMessage GetExpenseImage(int id)
        {
            //var expense = Uow.Expenses.Include(e => e.ExpenseReport.Employee).GetById(id);
            //if (expense == null)
            //{
            //    throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            //}

            //if (expense.ExpenseReport.Employee.UserId != User.Identity.Name)
            //{
            //    // Trying to access a record that does not belong to the user
            //    throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.Unauthorized));
            //}

            //var dto = new ImageDto
            //{
            //    Image = expense.Image,
            //    ImageType = expense.ImageType
            //};

            var response = Request.CreateResponse(HttpStatusCode.Created); //, dto);
            //response.Headers.CacheControl = new System.Net.Http.Headers.CacheControlHeaderValue { MaxAge = new System.TimeSpan(0, 10, 0) };
            return response;
        }

        public HttpResponseMessage PutImage(int id, ImageDto dto)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            //if (id != dto.ExpenseId)
            //{
            //    return Request.CreateResponse(HttpStatusCode.BadRequest);
            //}

            //var existingExpense = Uow.Expenses.Include(e => e.ExpenseReport.Employee).GetById(id);
            //if (existingExpense.ExpenseReport.Employee.UserId != User.Identity.Name)
            //{
            //    // Trying to modify a record that does not belong to the user
            //    return Request.CreateResponse(HttpStatusCode.Unauthorized);
            //}

            var temp = dto;
            // We only update images in this controller
            //existingExpense.Image = dto.Image;
            //existingExpense.ImageType = dto.ImageType;

            //try
            //{
            //    Uow.Expenses.Update(existingExpense);
            //    Uow.Commit();
            //}
            //catch (DbUpdateConcurrencyException)
            //{
            //    return Request.CreateResponse(HttpStatusCode.InternalServerError);
            //}

            return Request.CreateResponse(HttpStatusCode.OK);
        }

       
    }
}