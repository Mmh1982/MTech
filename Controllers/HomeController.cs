using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MTech.Models;
using MTech.Objects;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace MTech.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View(new List<ShoppingCart>());
        }

        [HttpPost]
        public IActionResult NuevaCompra(List<ShoppingCart> data)
        {
            string _id = DateTime.Now.ToString("ddMMyyHHmmss");
            data.Add(new ShoppingCart()
            {
                Id = _id,
                FechaCompra = DateTime.Now,
                TotalCompra = 0,
                Items = new List<Item>()
            });
            ViewBag.IdCompra = _id;
            return PartialView(data);
        }

        [HttpPost]
        public IActionResult VerCompra(List<ShoppingCart> data, string Id)
        {
            ViewBag.IdCompra = Id;
            return PartialView("NuevaCompra", data);
        }

        [HttpPost]
        public JsonResult NuevoItem(List<ShoppingCart> data, Item item, string id)
        {
            bool existe = false;
            foreach (ShoppingCart ite in data.Where(f => f.Id == id))
            {
                foreach (Item det in ite.Items)
                    if (det.Nombre.Trim().ToLower() == item.Nombre.Trim().ToLower())
                    {
                        det.Cantidad += item.Cantidad;
                        det.Precio = item.Precio;
                        existe = true;
                    }
                if (!existe)
                {
                    item.Id = DateTime.Now.ToString("ddMMyyHHmmss");
                    ite.Items.Add(item);
                }
            }            
            return Json(JsonConvert.SerializeObject(data));            
        }

        [HttpPost]
        public JsonResult ElimiarItem(List<ShoppingCart> data, string id)
        {
            foreach (ShoppingCart ite in data)
                foreach(Item det in ite.Items)
                    if (det.Id == id)
                    {
                        ite.Items.Remove(det);
                        break;
                    }
            return Json(JsonConvert.SerializeObject(data));
        }

        [HttpPost]
        public IActionResult ListaItems(List<ShoppingCart> data, string id)
        {
            foreach (ShoppingCart ite in data.Where(f => f.Id == id))
                return PartialView(ite.Items);
            return PartialView(new List<Item>());          
        }

        [HttpPost]
        public IActionResult ListaCompras(List<ShoppingCart> data)
        {
            return PartialView(data);
        }

        [HttpPost]
        public IActionResult EliminarCompra(List<ShoppingCart> data, string id)
        {
            data.Remove(data.Where(f => f.Id == id).FirstOrDefault());
            return PartialView("ListaCompras", data);
        }

        [HttpPost]
        public JsonResult TotalItems(List<ShoppingCart> data, string id)
        {
            double total = 0;
            foreach(ShoppingCart ite in data.Where(f => f.Id == id))
            {
                foreach (Item det in ite.Items)
                    total += det.Cantidad;
            }
            return Json(total);
        }

        [HttpPost]
        public JsonResult TotalCompra(List<ShoppingCart> data, string id)
        {
            double total = 0;
            foreach (ShoppingCart ite in data.Where(f => f.Id == id))
            {
                foreach (Item det in ite.Items)
                    total += (det.Cantidad * det.Precio);
            }
            return Json(total.ToString("$ ###,###,###,###.00"));
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}