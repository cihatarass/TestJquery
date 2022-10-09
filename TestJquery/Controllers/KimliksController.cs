using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using TestJquery.Models;

namespace TestJquery.Controllers
{
    public class KimliksController : Controller
    {
        private JqueryTestEntities db = new JqueryTestEntities();

        // GET: Kimliks
        public ActionResult Index()
        {
            return View();
        }


        public JsonResult Veriler()
        {
            var veriler = db.Kimlik.ToList();

            return Json(
                new
                {
                    Result = from obj in veriler
                             select new
                             {
                                 obj.id,
                                 obj.ad,
                                 obj.soyad,
                                 obj.no,
                             }
                }, JsonRequestBehavior.AllowGet
                );
        }

        public JsonResult EkleJson(string ad, string soyad, string no)
        {
            Kimlik kmlk = new Kimlik();
            kmlk.ad = ad;
            kmlk.soyad = soyad;
            kmlk.no = no;
            db.Kimlik.Add(kmlk);
            var durum = db.SaveChanges();
            if (durum > 0)
                return Json("1");
            else return Json("0");


        }

        [HttpPost]
        public JsonResult SilJson(int[] data)
        {
            foreach (var id in data)
            {
                var kimlik = db.Kimlik.FirstOrDefault(x=>x.id == id);
                db.Kimlik.Remove(kimlik);
            }
            var durum = db.SaveChanges();
            if (durum > 0)
                return Json("1");
            else return Json("0");
        }

        [HttpPost]
        public JsonResult GuncelleJson(string id)
        {
            var ID = Convert.ToInt32(id);
            var veri = db.Kimlik.FirstOrDefault(x=>x.id == ID);

            return Json(
                new
                {
                    Result = new
                             {
                                 veri.id,
                                 veri.ad,
                                 veri.soyad,
                                 veri.no,
                             }
                }, JsonRequestBehavior.AllowGet
                );

        }


        [HttpPost]
        public JsonResult Guncelle(string id, string ad, string soyad, string no)
        {
            var ID = Convert.ToInt32(id);
            var kmlk = db.Kimlik.FirstOrDefault(x => x.id == ID);
            kmlk.ad = ad;
            kmlk.soyad = soyad;
            kmlk.no = no;
            var durum = db.SaveChanges();
            if (durum > 0)
                return Json("1");
            else return Json("0");


        }

        // GET: Kimliks/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Kimlik kimlik = db.Kimlik.Find(id);
            if (kimlik == null)
            {
                return HttpNotFound();
            }
            return View(kimlik);
        }

        // GET: Kimliks/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Kimliks/Create
        // Aşırı gönderim saldırılarından korunmak için bağlamak istediğiniz belirli özellikleri etkinleştirin. 
        // Daha fazla bilgi için bkz. https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "id,ad,soyad,no")] Kimlik kimlik)
        {
            if (ModelState.IsValid)
            {
                db.Kimlik.Add(kimlik);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(kimlik);
        }

        // GET: Kimliks/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Kimlik kimlik = db.Kimlik.Find(id);
            if (kimlik == null)
            {
                return HttpNotFound();
            }
            return View(kimlik);
        }

        // POST: Kimliks/Edit/5
        // Aşırı gönderim saldırılarından korunmak için bağlamak istediğiniz belirli özellikleri etkinleştirin. 
        // Daha fazla bilgi için bkz. https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "id,ad,soyad,no")] Kimlik kimlik)
        {
            if (ModelState.IsValid)
            {
                db.Entry(kimlik).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(kimlik);
        }

        // GET: Kimliks/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Kimlik kimlik = db.Kimlik.Find(id);
            if (kimlik == null)
            {
                return HttpNotFound();
            }
            return View(kimlik);
        }

        // POST: Kimliks/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Kimlik kimlik = db.Kimlik.Find(id);
            db.Kimlik.Remove(kimlik);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
