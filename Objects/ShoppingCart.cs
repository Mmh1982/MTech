using System;
using System.Collections.Generic;

namespace MTech.Objects
{
    public class ShoppingCart
    {
        public ShoppingCart()
        {
            Items = new List<Item>();
        }

        public string Id { get; set; }
        public DateTime FechaCompra { get; set; }
        public double TotalCompra { get; set; }
        public List<Item> Items { get; set; }
    }
}