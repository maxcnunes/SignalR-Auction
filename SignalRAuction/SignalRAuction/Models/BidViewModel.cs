using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SignalRAuction.Models
{
    public class AuctionViewModel
    {
        public double ProductPrice { get; set; }
        public int TimeRemaining { get; set; }
        public string TypeTime { get; set; }

        public double BidPrice { get; set; }
        public int BidsTotal { get; set; }
    }
}